import { NextRequest, NextResponse } from 'next/server';
import { fal } from '@fal-ai/client';
import { buildPrompt } from '@/src/lib/prompts';
import type { UserDetails } from '@/src/lib/prompts';

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
  userDetails?: UserDetails | null;
}

interface FalKontextResult {
  images: Array<{ url: string; content_type?: string }>;
  seed?: number;
  has_nsfw_concepts?: boolean[];
  prompt?: string;
}

/* ─── Estimated cost per generation ──────────────────────── */
const ESTIMATED_COST_USD = 0.04;

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
        },
        body.userDetails
      );
    } catch (e) {
      return NextResponse.json(
        { error: (e as Error).message },
        { status: 400 }
      );
    }

    /* ── Check for FAL API key ──────────────────────────── */
    const falApiKey = process.env.FAL_API_KEY;

    if (!falApiKey) {
      console.log('──────────────────────────────────────────');
      console.log('[FanShot] ⚠️  No FAL_API_KEY — MOCK MODE');
      console.log('[FanShot] Prompt:', prompt.slice(0, 150), '...');
      console.log('[FanShot] Selfies count:', body.selfieBase64Array?.length || 1);
      console.log('[FanShot] Scene:', scene);
      console.log('[FanShot] Player:', playerName, '(' + (playerCountry || 'N/A') + ')');
      console.log('──────────────────────────────────────────');

      await new Promise((r) => setTimeout(r, 2500));

      return NextResponse.json({
        imageUrl: MOCK_IMAGE_URL,
        prompt,
        processingTime: Date.now() - startTime,
        mock: true,
      });
    }

    /* ── Configure fal.ai client ──────────────────────────── */
    fal.config({ credentials: falApiKey });

    /* Prepare selfie data URL */
    const selfieDataUrl = selfieBase64.startsWith('data:')
      ? selfieBase64
      : `data:image/jpeg;base64,${selfieBase64}`;

    /* ── Logging ───────────────────────────────────────────── */
    console.log('══════════════════════════════════════════');
    console.log('[FanShot] 🎯 Starting AI Generation');
    console.log('[FanShot] Model: fal-ai/flux-pro/kontext');
    console.log('[FanShot] Scene:', scene);
    console.log('[FanShot] Player:', playerName, '(' + (playerCountry || 'N/A') + ')');
    console.log('[FanShot] Selfies count:', body.selfieBase64Array?.length || 1);
    console.log('[FanShot] Prompt (first 200 chars):', prompt.slice(0, 200), '...');
    console.log('[FanShot] Estimated cost: ~$' + ESTIMATED_COST_USD.toFixed(2));
    console.log('══════════════════════════════════════════');

    /* ── Real fal.ai API call via @fal-ai/client ──────────── */
    try {
      const result = await Promise.race([
        fal.subscribe('fal-ai/flux-pro/kontext', {
          input: {
            prompt,
            image_url: selfieDataUrl,
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
      const imageUrl = result.data?.images?.[0]?.url;

      /* ── Check for NSFW content ─────────────────────────── */
      if (result.data?.has_nsfw_concepts?.[0]) {
        console.warn('[FanShot] ⛔ NSFW content detected — blocking');
        return NextResponse.json(
          { error: 'The generated image was flagged as inappropriate. Please try a different photo or scene.' },
          { status: 422 }
        );
      }

      if (!imageUrl) {
        console.error('[FanShot] ❌ No image URL in response:', JSON.stringify(result.data).slice(0, 500));
        return NextResponse.json(
          { error: 'No image returned from AI' },
          { status: 502 }
        );
      }

      /* ── Success logging ────────────────────────────────── */
      console.log('══════════════════════════════════════════');
      console.log('[FanShot] ✅ Generation complete!');
      console.log('[FanShot] Duration:', (duration / 1000).toFixed(1) + 's');
      console.log('[FanShot] Cost: ~$' + ESTIMATED_COST_USD.toFixed(2));
      console.log('[FanShot] Image URL:', imageUrl.slice(0, 80) + '...');
      console.log('[FanShot] Request ID:', result.requestId || 'N/A');
      console.log('══════════════════════════════════════════');

      return NextResponse.json({
        imageUrl,
        prompt,
        processingTime: duration,
        mock: false,
      });
    } catch (falErr) {
      const duration = Date.now() - startTime;
      const errMessage = (falErr as Error).message || String(falErr);

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
