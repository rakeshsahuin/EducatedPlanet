/**
 * Utility functions for image cropping
 */

export interface Area {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Creates a canvas element with the cropped image
 * @param imageSrc - The source image data URL
 * @param pixelCrop - The crop area in pixels
 * @returns Promise<HTMLCanvasElement> - The cropped canvas
 */
export function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area
): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('No 2d context'));
        return;
      }

      // Set canvas size to the cropped area
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;

      // Draw the cropped image
      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );

      resolve(canvas);
    };
    image.onerror = () => reject(new Error('Failed to load image'));
    image.src = imageSrc;
  });
}

/**
 * Generates a blob from a cropped image
 * @param canvas - The canvas element
 * @param type - The image type (e.g., 'image/jpeg')
 * @param quality - The image quality (0-1)
 * @returns Promise<Blob> - The image blob
 */
export function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string = 'image/jpeg',
  quality: number = 0.9
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create blob'));
        }
      },
      type,
      quality
    );
  });
}

/**
 * Converts a file to a data URL
 * @param file - The image file
 * @returns Promise<string> - The data URL
 */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}