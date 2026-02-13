import { NextRequest, NextResponse } from 'next/server';
import { fal } from '@fal-ai/client';
import { buildPrompt } from '@/src/lib/prompts';
import { createAdminClient, isAdminConfigured } from '@/src/lib/supabase-admin';
import { uploadSelfie, uploadGenerated, getGeneratedPublicUrl } from '@/src/lib/storage';

/* ─── Mock placeholder for when FAL_API_KEY is missing ── */

const MOCK_IMAGE_URL =
  'https://fal.media/files/penguin/OhNORVhHSIOfTpCvsbnAa_image.webp';

/* ─── Helper: convert base64 data URI to Blob (Node.js) ── */

function base64ToBlob(base64DataUri: string): Blob {
  const matches = base64DataUri.match(/^data:(.+?);base64,(.+)$/);
  if (!matches) {
    throw new Error('Invalid base64 data URI format');
  }
  const mimeType = matches[1];
  const rawBase64 = matches[2];
  const buffer = Buffer.from(rawBase64, 'base64');
  return new Blob([buffer], { type: mimeType });
}

/* ─── Helper: upload base64 image to fal.ai storage ────── */

async function uploadToFalStorage(base64DataUri: string, label: string): Promise<string> {
  console.log(`[FanShot] 📤 Uploading ${label} to fal.ai storage...`);
  const start = Date.now();
  const blob = base64ToBlob(base64DataUri);
  console.log(`[FanShot]    Size: ${(blob.size / 1024).toFixed(0)}KB`);
  const falUrl = await fal.storage.upload(
    new File([blob], `${label}.jpg`, { type: blob.type || 'image/jpeg' })
  );
  console.log(`[FanShot] ✅ ${label} uploaded in ${Date.now() - start}ms → ${falUrl}`);
  return falUrl;
}

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

interface FalFaceSwapResult {
  image: { url: string; content_type?: string; width?: number; height?: number };
}

/* ─── Estimated costs ────────────────────────────────────── */
const COST_STAGE1 = 0.06; // FLUX Kontext Max scene generation
const COST_STAGE2 = 0.04; // Easel AI face swap
const COST_TOTAL = COST_STAGE1 + COST_STAGE2;

/* ─── Helper: get auth user from request ────────────────── */

async function getAuthUser(req: NextRequest): Promise<string | null> {
  if (!isAdminConfigured) return null;
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    if (!token) {
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

/* ─── POST handler — 2-Stage Pipeline ──────────────────── */

export async function POST(req: NextRequest) {
  const startTime = Date.now();

  try {
    /* ── Body size guard ─────────────────────────────────── */
    const contentLength = parseInt(req.headers.get('content-length') || '0', 10);
    if (contentLength > 4 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Photo is too large. Please try a smaller photo.' },
        { status: 413 }
      );
    }

    const body = (await req.json()) as GenerateRequest;
    const { selfieBase64, scene, playerName, playerCountry, playerNumber, teamColors } = body;

    /* ── Validate ────────────────────────────────────────── */
    const base64Size = selfieBase64 ? selfieBase64.length : 0;
    if (base64Size > 3 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Photo is too large after encoding. Please use a smaller photo.' },
        { status: 413 }
      );
    }
    if (!selfieBase64 || !scene || !playerName) {
      return NextResponse.json(
        { error: 'Missing required fields: selfieBase64, scene, playerName' },
        { status: 400 }
      );
    }

    const userId = await getAuthUser(req);

    /* ── Build prompt (Stage 1: scene generation) ────────── */
    let prompt: string;
    try {
      prompt = buildPrompt(scene, {
        playerName,
        playerCountry: playerCountry || 'International',
        playerNumber: playerNumber || 10,
        teamColors: teamColors || ['#FFFFFF', '#000000'],
      });
    } catch (e) {
      return NextResponse.json({ error: (e as Error).message }, { status: 400 });
    }

    /* ── Upload selfie to Supabase Storage (for records) ─── */
    let selfiePath: string | null = null;

    if (userId && isAdminConfigured) {
      try {
        selfiePath = await uploadSelfie(userId, selfieBase64);
      } catch (storageErr) {
        console.warn('[FanShot] Selfie Supabase upload failed:', storageErr);
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
            input_image_url: selfiePath ? `storage://selfies/${selfiePath}` : 'base64-inline',
            scene_type: scene,
            player_style: playerName,
            prompt_used: prompt.slice(0, 2000),
            status: 'processing',
            is_free: false,
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
      console.log('[FanShot] Pipeline: 2-STAGE (scene gen + face swap)');
      console.log('[FanShot] Scene:', scene, '| Player:', playerName);
      console.log('[FanShot] Prompt:', prompt.slice(0, 200), '...');
      console.log('──────────────────────────────────────────');

      await new Promise((r) => setTimeout(r, 2500));

      if (generationId && userId && isAdminConfigured) {
        const admin = createAdminClient();
        await admin.from('generations').update({
          output_image_url: MOCK_IMAGE_URL,
          status: 'completed',
          processing_time_ms: Date.now() - startTime,
        }).eq('id', generationId);
        await admin.rpc('spend_credit', { p_user_id: userId, p_generation_id: generationId });
      }

      return NextResponse.json({
        imageUrl: MOCK_IMAGE_URL,
        generationId,
        prompt,
        processingTime: Date.now() - startTime,
        mock: true,
      });
    }

    /* ── Configure fal.ai ────────────────────────────────── */
    fal.config({ credentials: falApiKey });

    console.log('══════════════════════════════════════════════════');
    console.log('[FanShot] 🎯 2-STAGE PIPELINE — Starting');
    console.log('[FanShot] Scene:', scene, '| Player:', playerName, '(' + playerCountry + ')');
    console.log('[FanShot] User:', userId || 'anonymous', '| Gen ID:', generationId || 'N/A');
    console.log('[FanShot] Est. cost: ~$' + COST_TOTAL.toFixed(2));
    console.log('══════════════════════════════════════════════════');

    /* ════════════════════════════════════════════════════════
     * STAGE 1: Generate scene image (text-to-image)
     * Model: fal-ai/flux-pro/kontext/max
     * No reference image — pure text prompt
     * ════════════════════════════════════════════════════════ */

    console.log('[FanShot] ══ STAGE 1: Generating scene image ══');
    console.log('[FanShot] Model: fal-ai/flux-pro/v1.1 (text-to-image)');
    console.log('[FanShot] Prompt (first 300 chars):', prompt.slice(0, 300), '...');

    const stage1Start = Date.now();
    let sceneImageUrl: string;

    try {
      const sceneResult = await Promise.race([
        fal.subscribe('fal-ai/flux-pro/v1.1', {
          input: {
            prompt,
            num_images: 1,
            output_format: 'jpeg' as const,
            safety_tolerance: '5' as const,
            image_size: { width: 768, height: 1024 },
          },
          logs: true,
          onQueueUpdate: (update) => {
            if (update.status === 'IN_QUEUE') console.log('[FanShot] Stage 1 ⏳ In queue...');
            if (update.status === 'IN_PROGRESS') console.log('[FanShot] Stage 1 🔄 Generating...');
          },
        }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('STAGE1_TIMEOUT')), 90_000)
        ),
      ]) as { data: FalKontextResult; requestId?: string };

      sceneImageUrl = sceneResult.data?.images?.[0]?.url;

      if (!sceneImageUrl) {
        throw new Error('No image returned from Stage 1');
      }

      const stage1Duration = Date.now() - stage1Start;
      console.log(`[FanShot] ✅ Stage 1 complete in ${(stage1Duration / 1000).toFixed(1)}s`);
      console.log(`[FanShot] Scene image: ${sceneImageUrl.slice(0, 80)}...`);

    } catch (stage1Err) {
      const errMsg = (stage1Err as Error).message || String(stage1Err);
      console.error('[FanShot] ❌ Stage 1 failed:', errMsg);

      if (generationId && isAdminConfigured) {
        const admin = createAdminClient();
        await admin.from('generations').update({
          status: 'failed',
          processing_time_ms: Date.now() - startTime,
        }).eq('id', generationId);
      }

      if (errMsg === 'STAGE1_TIMEOUT') {
        return NextResponse.json({ error: 'Scene generation timed out. Please try again.' }, { status: 504 });
      }
      if (errMsg.includes('401') || errMsg.includes('Unauthorized')) {
        return NextResponse.json({ error: 'AI service authentication failed.' }, { status: 401 });
      }
      if (errMsg.includes('429') || errMsg.includes('rate limit')) {
        return NextResponse.json({ error: 'AI service is busy. Please try again shortly.' }, { status: 429 });
      }
      return NextResponse.json({ error: 'Scene generation failed. Please try again.' }, { status: 502 });
    }

    /* ════════════════════════════════════════════════════════
     * STAGE 2: Face swap — replace generic fan with user's selfie
     * Model: easel-ai/advanced-face-swap
     * ════════════════════════════════════════════════════════ */

    console.log('[FanShot] ══ STAGE 2: Face swap ══');
    console.log('[FanShot] Model: easel-ai/advanced-face-swap');

    const stage2Start = Date.now();
    let finalImageUrl: string;

    try {
      // Upload selfie to fal.ai storage for face swap
      const selfieDataUri = selfieBase64.startsWith('data:')
        ? selfieBase64
        : `data:image/jpeg;base64,${selfieBase64}`;

      const selfieUrl = await uploadToFalStorage(selfieDataUri, 'selfie');
      console.log('[FanShot] Selfie uploaded for face swap');

      const swapResult = await Promise.race([
        fal.subscribe('easel-ai/advanced-face-swap', {
          input: {
            face_image_0: { url: selfieUrl },
            gender_0: 'male' as const,
            target_image: { url: sceneImageUrl },
            workflow_type: 'user_hair' as const,
            upscale: true,
          },
          logs: true,
          onQueueUpdate: (update) => {
            if (update.status === 'IN_QUEUE') console.log('[FanShot] Stage 2 ⏳ In queue...');
            if (update.status === 'IN_PROGRESS') console.log('[FanShot] Stage 2 🔄 Swapping...');
          },
        }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('STAGE2_TIMEOUT')), 90_000)
        ),
      ]) as { data: FalFaceSwapResult; requestId?: string };

      finalImageUrl = swapResult.data?.image?.url;

      if (!finalImageUrl) {
        throw new Error('No image returned from face swap');
      }

      const stage2Duration = Date.now() - stage2Start;
      console.log(`[FanShot] ✅ Stage 2 complete in ${(stage2Duration / 1000).toFixed(1)}s`);
      console.log(`[FanShot] Final image: ${finalImageUrl.slice(0, 80)}...`);

    } catch (stage2Err) {
      const errMsg = (stage2Err as Error).message || String(stage2Err);
      console.warn('[FanShot] ⚠️ Stage 2 (face swap) failed:', errMsg);
      console.log('[FanShot] ↩️ Falling back to Stage 1 scene image (no face swap)');

      // Fallback: return the scene image without face swap
      finalImageUrl = sceneImageUrl;
    }

    /* ── Upload result to Supabase Storage ────────────────── */
    const totalDuration = Date.now() - startTime;
    let storedImageUrl = finalImageUrl;

    if (userId && generationId && isAdminConfigured) {
      try {
        const storagePath = await uploadGenerated(userId, generationId, finalImageUrl);
        if (storagePath) {
          const publicUrl = getGeneratedPublicUrl(storagePath);
          if (publicUrl) storedImageUrl = publicUrl;
        }
      } catch (uploadErr) {
        console.warn('[FanShot] Result upload to Supabase failed:', uploadErr);
      }

      const admin = createAdminClient();
      await admin.from('generations').update({
        output_image_url: storedImageUrl,
        status: 'completed',
        processing_time_ms: totalDuration,
      }).eq('id', generationId);

      await admin.rpc('spend_credit', { p_user_id: userId, p_generation_id: generationId });
    }

    /* ── Success ──────────────────────────────────────────── */
    console.log('══════════════════════════════════════════════════');
    console.log('[FanShot] 🎉 2-STAGE PIPELINE COMPLETE!');
    console.log('[FanShot] Total duration:', (totalDuration / 1000).toFixed(1) + 's');
    console.log('[FanShot] Total cost: ~$' + COST_TOTAL.toFixed(2));
    console.log('[FanShot] Scene image:', sceneImageUrl.slice(0, 60) + '...');
    console.log('[FanShot] Final image:', storedImageUrl.slice(0, 60) + '...');
    console.log('[FanShot] Face swap:', finalImageUrl !== sceneImageUrl ? 'SUCCESS' : 'SKIPPED (fallback)');
    console.log('[FanShot] Storage:', storedImageUrl !== finalImageUrl ? 'Supabase' : 'fal.ai temporary');
    console.log('══════════════════════════════════════════════════');

    return NextResponse.json({
      imageUrl: storedImageUrl,
      generationId,
      prompt,
      processingTime: totalDuration,
      mock: false,
      stages: {
        scene: sceneImageUrl,
        final: storedImageUrl,
        faceSwapSuccess: finalImageUrl !== sceneImageUrl,
      },
    });

  } catch (err) {
    console.error('[FanShot] 💥 Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
