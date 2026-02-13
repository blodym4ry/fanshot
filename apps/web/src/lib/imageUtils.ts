/**
 * FanShot Client-Side Image Compression
 *
 * Solves Vercel's 4.5MB body limit by resizing and compressing
 * selfie images before sending as base64 to the API.
 *
 * Before: raw File → FileReader → base64 (5-10MB possible)
 * After:  raw File → canvas resize → JPEG compress → base64 (200-500KB)
 */

/**
 * Compress a single image file to a smaller JPEG base64 string.
 *
 * @param file      — original File from <input type="file">
 * @param maxWidth  — maximum pixel width (default 1024)
 * @param quality   — JPEG quality 0-1 (default 0.8)
 * @returns         — data:image/jpeg;base64,... string
 */
export function compressImage(
  file: File,
  maxWidth = 1024,
  quality = 0.8
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Canvas 2D context not available'));
      return;
    }

    img.onload = () => {
      // Maintain aspect ratio, cap at maxWidth
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      // Compress as JPEG
      const base64 = canvas.toDataURL('image/jpeg', quality);

      // Cleanup object URL
      URL.revokeObjectURL(img.src);

      resolve(base64);
    };

    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(new Error('Failed to load image for compression'));
    };

    img.src = URL.createObjectURL(file);
  });
}

/**
 * Compress multiple image files.
 *
 * @param files     — array of File objects
 * @param maxWidth  — maximum pixel width (default 1024)
 * @param quality   — JPEG quality 0-1 (default 0.8)
 * @returns         — array of data:image/jpeg;base64,... strings
 */
export function compressImages(
  files: File[],
  maxWidth = 1024,
  quality = 0.8
): Promise<string[]> {
  return Promise.all(files.map((f) => compressImage(f, maxWidth, quality)));
}
