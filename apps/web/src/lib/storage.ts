import { createAdminClient, isAdminConfigured } from './supabase-admin';

/**
 * FanShot Storage Helpers
 *
 * Buckets (create via setup.sql or Supabase Dashboard):
 *   - selfies   (private, max 10MB, image/* only)
 *   - generated  (public,  max 10MB, image/* only)
 */

/* ─── Upload selfie from base64 ─────────────────────────── */

export async function uploadSelfie(
  userId: string,
  base64DataUrl: string
): Promise<string | null> {
  if (!isAdminConfigured) return null;

  const admin = createAdminClient();

  // Extract base64 content and content type
  const match = base64DataUrl.match(/^data:(image\/\w+);base64,(.+)$/);
  if (!match) return null;

  const contentType = match[1];
  const base64Data = match[2];
  const buffer = Buffer.from(base64Data, 'base64');
  const ext = contentType.split('/')[1] || 'jpeg';
  const path = `${userId}/${Date.now()}.${ext}`;

  const { error } = await admin.storage
    .from('selfies')
    .upload(path, buffer, {
      contentType,
      upsert: false,
    });

  if (error) {
    console.error('[Storage] Selfie upload error:', error.message);
    return null;
  }

  return path;
}

/* ─── Get signed URL for private selfie ─────────────────── */

export async function getSelfieUrl(path: string): Promise<string | null> {
  if (!isAdminConfigured) return null;

  const admin = createAdminClient();
  const { data, error } = await admin.storage
    .from('selfies')
    .createSignedUrl(path, 3600); // 1 hour

  if (error) {
    console.error('[Storage] Signed URL error:', error.message);
    return null;
  }

  return data.signedUrl;
}

/* ─── Upload generated image from URL ───────────────────── */

export async function uploadGenerated(
  userId: string,
  generationId: string,
  imageUrl: string
): Promise<string | null> {
  if (!isAdminConfigured) return null;

  const admin = createAdminClient();

  try {
    // Download image from fal.ai temporary URL
    const response = await fetch(imageUrl);
    if (!response.ok) {
      console.error('[Storage] Failed to download generated image:', response.status);
      return null;
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const ext = contentType.split('/')[1]?.split(';')[0] || 'jpeg';
    const path = `${userId}/${generationId}.${ext}`;

    const { error } = await admin.storage
      .from('generated')
      .upload(path, buffer, {
        contentType,
        upsert: false,
      });

    if (error) {
      console.error('[Storage] Generated upload error:', error.message);
      return null;
    }

    return path;
  } catch (err) {
    console.error('[Storage] Upload generated error:', err);
    return null;
  }
}

/* ─── Get public URL for generated image ────────────────── */

export function getGeneratedPublicUrl(path: string): string | null {
  if (!isAdminConfigured) return null;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) return null;

  return `${supabaseUrl}/storage/v1/object/public/generated/${path}`;
}

/* ─── Delete selfie ─────────────────────────────────────── */

export async function deleteSelfie(path: string): Promise<boolean> {
  if (!isAdminConfigured) return false;

  const admin = createAdminClient();
  const { error } = await admin.storage
    .from('selfies')
    .remove([path]);

  if (error) {
    console.error('[Storage] Delete selfie error:', error.message);
    return false;
  }

  return true;
}
