import { NextRequest, NextResponse } from 'next/server';
import { fal } from '@fal-ai/client';
import { buildPrompt } from '@/src/lib/prompts';
import { createAdminClient, isAdminConfigured } from '@/src/lib/supabase-admin';
import { uploadSelfie, uploadGenerated, getGeneratedPublicUrl } from '@/src/lib/storage';

/* ─── Mock placeholder for when FAL_API_KEY is missing ── */

const MOCK_IMAGE_URL =
  'https://fal.media/files/penguin/OhNORVhHSIOfTpCvsbnAa_image.webp';

/* ─── Types ─────────────────────────────────────────────── */

interface GenerateRequest {
  selfieBase64: string;
  selfieBase64Array?: string[];
  scene: string;
  playerName: string;
  playerCountry: string;
  playerNumber: number;
  teamColors: [string, string];
}

interface FalKontextResult {
  images: Array<{ url: string; content_type?: string }>;
  seed?: number;
  has_nsfw_concepts?: boolean[];
  prompt?: string;
}

/* ─── Estimated cost per generation ──────────────────────── */
const ESTIMATED_COST_USD = 0.04;

/* ─── Helper: get auth user from request ────────────────── */

async function getAuthUser(req: NextRequest): Promise<string | null> {
  if (!isAdminConfigured) return null;

  try {
    // Read the Supabase auth token from cookie or header
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      // Try to get from cookie (SSR auth)
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
      const projectRef = supabaseUrl.match(/https:\/\/(.+)\.supabase\.co/)?.[1] || '';
      const cookieName = `sb-${projectRef}-auth-token`;
      const cookie = req.cookies.get(cookieName);
      if (!cookie) return null;

      try {
        const parsed = JSON.parse(cookie.value);
        const accessToken = parsed?.[0] || parsed?.access_token;
        if (!accessToken) return null;

        const admin = createAdminClient();
        const { data } = await admin.auth.getUser(accessToken);
        return data.user?.id || null;
      } catch {
        return null;
      }
    }

    const admin = createAdminClient();
    const { data } = await admin.auth.getUser(token);
    return data.user?.id || null;
  } catch {
    return null;
  }
}

/* ─── POST handler ──────────────────────────────────────── */

export async function POST(req: NextRequest) {
  const startTime = Date.now();

  try {
    const body = (await req.json()) as GenerateRequest;
    const { selfieBase64, scene, playerName, playerCountry, playerNumber, teamColors } = body;

    /* Validate required fields */
    if (!selfieBase64 || !scene || !playerName) {
      return NextResponse.json(
        { error: 'Missing required fields: selfieBase64, scene, playerName' },
        { status: 400 }
      );
    }

    /* Get authenticated user (may be null in dev mode) */
    const userId = await getAuthUser(req);

    /* Build prompt */
    let prompt: string;
    try {
      prompt = buildPrompt(
        scene,
        {
          playerName,
          playerCountry: playerCountry || 'International',
          playerNumber: playerNumber || 10,
          teamColors: teamColors || ['#FFFFFF', '#000000'],
        }
      );
    } catch (e) {
      return NextResponse.json(
        { error: (e as Error).message },
        { status: 400 }
      );
    }

    /* ── Upload selfie to Supabase Storage (if configured) ── */
    let selfiePath: string | null = null;
    let selfieStorageUrl: string | null = null;

    if (userId && isAdminConfigured) {
      selfiePath = await uploadSelfie(userId, selfieBase64);
      if (selfiePath) {
        // Create a signed URL for fal.ai to access the selfie
        const admin = createAdminClient();
        const { data } = await admin.storage
          .from('selfies')
          .createSignedUrl(selfiePath, 600); // 10 min expiry for AI processing
        selfieStorageUrl = data?.signedUrl || null;
      }
    }

    /* ── Create generation record in DB ──────────────────── */
    let generationId: string | null = null;

    if (userId && isAdminConfigured) {
      try {
        const admin = createAdminClient();
        const { data: genRow, error: genErr } = await admin
          .from('generations')
          .insert({
            user_id: userId,
            input_image_url: selfiePath
              ? `storage://selfies/${selfiePath}`
              : 'base64-inline',
            scene_type: scene,
            player_style: playerName,
            prompt_used: prompt.slice(0, 2000),
            status: 'processing',
            is_free: false, // will be updated by spend_credit()
          })
          .select('id')
          .single();

        if (genErr) {
          console.error('[FanShot] DB insert error:', genErr.message);
        } else {
          generationId = genRow?.id || null;
        }
      } catch (dbErr) {
        console.error('[FanShot] DB error:', dbErr);
      }
    }

    /* ── Check for FAL API key ──────────────────────────── */
    const falApiKey = process.env.FAL_API_KEY;

    if (!falApiKey) {
      console.log('──────────────────────────────────────────');
      console.log('[FanShot] ⚠️  No FAL_API_KEY — MOCK MODE');
      console.log('[FanShot] Prompt:', prompt.slice(0, 150), '...');
      console.log('[FanShot] Scene:', scene);
      console.log('[FanShot] Player:', playerName);
      console.log('[FanShot] User ID:', userId || 'anonymous');
      console.log('──────────────────────────────────────────');

      await new Promise((r) => setTimeout(r, 2500));

      // Update generation record to completed (mock)
      if (generationId && userId && isAdminConfigured) {
        const admin = createAdminClient();
        await admin
          .from('generations')
          .update({
            output_image_url: MOCK_IMAGE_URL,
            status: 'completed',
            processing_time_ms: Date.now() - startTime,
          })
          .eq('id', generationId);

        // Spend credit via DB function
        await admin.rpc('spend_credit', {
          p_user_id: userId,
          p_generation_id: generationId,
        });
      }

      return NextResponse.json({
        imageUrl: MOCK_IMAGE_URL,
        generationId,
        prompt,
        processingTime: Date.now() - startTime,
        mock: true,
      });
    }

    /* ── Configure fal.ai client ──────────────────────────── */
    fal.config({ credentials: falApiKey });

    /* Prepare selfie image URL for fal.ai */
    const selfieImageUrl = selfieStorageUrl
      || (selfieBase64.startsWith('data:')
        ? selfieBase64
        : `data:image/jpeg;base64,${selfieBase64}`);

    /* ── Logging ───────────────────────────────────────────── */
    console.log('══════════════════════════════════════════');
    console.log('[FanShot] 🎯 Starting AI Generation');
    console.log('[FanShot] Model: fal-ai/flux-pro/kontext');
    console.log('[FanShot] Scene:', scene);
    console.log('[FanShot] Player:', playerName, '(' + (playerCountry || 'N/A') + ')');
    console.log('[FanShot] User ID:', userId || 'anonymous');
    console.log('[FanShot] Generation ID:', generationId || 'N/A');
    console.log('[FanShot] Selfie source:', selfieStorageUrl ? 'Supabase Storage' : 'base64 inline');
    console.log('[FanShot] Prompt (first 200 chars):', prompt.slice(0, 200), '...');
    console.log('[FanShot] Estimated cost: ~$' + ESTIMATED_COST_USD.toFixed(2));
    console.log('══════════════════════════════════════════');

    /* ── Real fal.ai API call via @fal-ai/client ──────────── */
    try {
      const result = await Promise.race([
        fal.subscribe('fal-ai/flux-pro/kontext', {
          input: {
            prompt,
            image_url: selfieImageUrl,
            guidance_scale: 3.5,
            output_format: 'jpeg' as const,
            num_images: 1,
            safety_tolerance: '2' as const,
            aspect_ratio: '1:1' as const,
          },
          logs: true,
          onQueueUpdate: (update) => {
            if (update.status === 'IN_QUEUE') {
              console.log('[FanShot] ⏳ In queue...');
            } else if (update.status === 'IN_PROGRESS') {
              console.log('[FanShot] 🔄 Generating...');
            }
          },
        }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('TIMEOUT')), 90_000)
        ),
      ]) as { data: FalKontextResult; requestId?: string };

      const duration = Date.now() - startTime;
      const falImageUrl = result.data?.images?.[0]?.url;

      /* ── Check for NSFW content ─────────────────────────── */
      if (result.data?.has_nsfw_concepts?.[0]) {
        console.warn('[FanShot] ⛔ NSFW content detected — blocking');

        if (generationId && isAdminConfigured) {
          const admin = createAdminClient();
          await admin
            .from('generations')
            .update({ status: 'failed', processing_time_ms: duration })
            .eq('id', generationId);
        }

        return NextResponse.json(
          { error: 'The generated image was flagged as inappropriate. Please try a different photo or scene.' },
          { status: 422 }
        );
      }

      if (!falImageUrl) {
        console.error('[FanShot] ❌ No image URL in response:', JSON.stringify(result.data).slice(0, 500));

        if (generationId && isAdminConfigured) {
          const admin = createAdminClient();
          await admin
            .from('generations')
            .update({ status: 'failed', processing_time_ms: duration })
            .eq('id', generationId);
        }

        return NextResponse.json(
          { error: 'No image returned from AI' },
          { status: 502 }
        );
      }

      /* ── Upload generated image to Supabase Storage ────── */
      let finalImageUrl = falImageUrl;

      if (userId && generationId && isAdminConfigured) {
        const storagePath = await uploadGenerated(userId, generationId, falImageUrl);
        if (storagePath) {
          const publicUrl = getGeneratedPublicUrl(storagePath);
          if (publicUrl) {
            finalImageUrl = publicUrl;
          }
        }

        // Update generation record
        const admin = createAdminClient();
        await admin
          .from('generations')
          .update({
            output_image_url: finalImageUrl,
            status: 'completed',
            processing_time_ms: duration,
          })
          .eq('id', generationId);

        // Spend credit via DB function
        await admin.rpc('spend_credit', {
          p_user_id: userId,
          p_generation_id: generationId,
        });
      }

      /* ── Success logging ────────────────────────────────── */
      console.log('══════════════════════════════════════════');
      console.log('[FanShot] ✅ Generation complete!');
      console.log('[FanShot] Duration:', (duration / 1000).toFixed(1) + 's');
      console.log('[FanShot] Cost: ~$' + ESTIMATED_COST_USD.toFixed(2));
      console.log('[FanShot] Final Image URL:', finalImageUrl.slice(0, 80) + '...');
      console.log('[FanShot] Storage:', finalImageUrl !== falImageUrl ? 'Supabase' : 'fal.ai temporary');
      console.log('[FanShot] Request ID:', result.requestId || 'N/A');
      console.log('══════════════════════════════════════════');

      return NextResponse.json({
        imageUrl: finalImageUrl,
        generationId,
        prompt,
        processingTime: duration,
        mock: false,
      });
    } catch (falErr) {
      const duration = Date.now() - startTime;
      const errMessage = (falErr as Error).message || String(falErr);

      // Mark generation as failed
      if (generationId && isAdminConfigured) {
        const admin = createAdminClient();
        await admin
          .from('generations')
          .update({ status: 'failed', processing_time_ms: duration })
          .eq('id', generationId);
      }

      /* ── Timeout ────────────────────────────────────────── */
      if (errMessage === 'TIMEOUT') {
        console.error('[FanShot] ⏰ Generation timed out after 90s');
        return NextResponse.json(
          { error: 'AI generation timed out (90s limit). Please try again.' },
          { status: 504 }
        );
      }

      /* ── Invalid API key ────────────────────────────────── */
      if (errMessage.includes('401') || errMessage.includes('Unauthorized') || errMessage.includes('Invalid API')) {
        console.error('[FanShot] 🔑 Invalid FAL_API_KEY');
        return NextResponse.json(
          { error: 'AI service authentication failed. Please contact support.' },
          { status: 401 }
        );
      }

      /* ── Rate limit ─────────────────────────────────────── */
      if (errMessage.includes('429') || errMessage.includes('rate limit') || errMessage.includes('Too Many')) {
        console.error('[FanShot] 🚫 Rate limited by fal.ai');
        return NextResponse.json(
          { error: 'AI service is busy. Please try again in a few seconds.' },
          { status: 429 }
        );
      }

      /* ── NSFW / Safety filter ───────────────────────────── */
      if (errMessage.includes('NSFW') || errMessage.includes('safety') || errMessage.includes('content_filter')) {
        console.warn('[FanShot] ⛔ Content safety filter triggered');
        return NextResponse.json(
          { error: 'The image was flagged by our safety system. Please try a different photo.' },
          { status: 422 }
        );
      }

      /* ── Generic fal.ai error ───────────────────────────── */
      console.error('══════════════════════════════════════════');
      console.error('[FanShot] ❌ fal.ai error after', (duration / 1000).toFixed(1) + 's');
      console.error('[FanShot] Error:', errMessage);
      console.error('[FanShot] Full error:', JSON.stringify(falErr, null, 2).slice(0, 1000));
      console.error('══════════════════════════════════════════');

      return NextResponse.json(
        { error: `AI generation failed: ${errMessage.slice(0, 200)}` },
        { status: 502 }
      );
    }
  } catch (err) {
    console.error('[FanShot] 💥 Unexpected error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
