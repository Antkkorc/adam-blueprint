export const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
export const MAX_RENTAL_IMAGES = 10;
export const MAX_STUDENT_IMAGES = 20;

export function validateImageFiles(files: File[], maxCount: number): string | null {
  if (files.length > maxCount) return `Please upload no more than ${maxCount} images.`;
  if (files.some((file) => !file.type.startsWith("image/"))) {
    return "Only image files can be uploaded.";
  }
  if (files.some((file) => file.size > MAX_IMAGE_SIZE)) {
    return "Each image must be 10 MB or smaller.";
  }
  return null;
}
