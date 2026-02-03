/**
 * Image compression utilities for photo uploads
 * 
 * Mobile Behavior:
 * - Same HTML file input works on mobile browsers
 * - On mobile, <input type="file" accept="image/*"> triggers:
 *   - Camera app (take photo)
 *   - Photo gallery (choose existing)
 * - Photo is NOT copied to app - stays in device storage
 * - Only compressed base64 representation stored in IndexedDB
 * - Compression reduces 3-5MB photos to ~100-200KB
 * - Original photo remains untouched in device storage
 * 
 * Desktop Behavior:
 * - Opens file picker
 * - Same compression applied
 * - Original file unchanged
 */

export interface CompressImageOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0-1
  maxSizeKB?: number;
}

const DEFAULT_OPTIONS: CompressImageOptions = {
  maxWidth: 800,
  maxHeight: 800,
  quality: 0.8,
  maxSizeKB: 200,
};

/**
 * Compress an image file to reduce size while maintaining quality
 * Uses canvas API to resize and compress
 */
export async function compressImage(
  file: File,
  options: CompressImageOptions = {}
): Promise<string> {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error('Failed to read file'));

    reader.onload = (e) => {
      const img = new Image();

      img.onerror = () => reject(new Error('Failed to load image'));

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        const maxWidth = opts.maxWidth!;
        const maxHeight = opts.maxHeight!;

        if (width > maxWidth || height > maxHeight) {
          const aspectRatio = width / height;

          if (width > height) {
            width = maxWidth;
            height = width / aspectRatio;
          } else {
            height = maxHeight;
            width = height * aspectRatio;
          }
        }

        // Create canvas and draw resized image
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        // Use high-quality image smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Compress and get base64
        let quality = opts.quality!;
        let compressedData = canvas.toDataURL('image/jpeg', quality);

        // If still too large, reduce quality iteratively
        const maxSizeBytes = opts.maxSizeKB! * 1024;
        while (compressedData.length > maxSizeBytes && quality > 0.1) {
          quality -= 0.1;
          compressedData = canvas.toDataURL('image/jpeg', quality);
        }

        resolve(compressedData);
      };

      img.src = e.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Get human-readable file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Get size of base64 string in bytes
 */
export function getBase64Size(base64: string): number {
  // Remove data URL prefix if present
  const base64String = base64.split(',')[1] || base64;
  
  // Calculate actual byte size
  const padding = (base64String.match(/=/g) || []).length;
  return (base64String.length * 3) / 4 - padding;
}
