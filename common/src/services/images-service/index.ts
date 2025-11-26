import { CloudflareImagesClient } from './cloudflare-images';
import {
  CloudflareImageResponse,
  UploadImageOptions,
  ImageCategory,
  ImageUploadConfig,
  SoftDeleteImage,
  ImageUploadError
} from './types';
import { DEFAULT_IMAGE_CATEGORIES, getCategoryConfig, validateCategory } from './config';
import { validateFile, buildVariantUrls } from './utils';
import { softDeleteManager } from './soft-delete';

export class ImageUploadService {
  private static instance: ImageUploadService;
  private client: CloudflareImagesClient | null = null;
  private config: ImageUploadConfig | null = null;
  private initialized = false;

  private constructor() {}

  public static getInstance(): ImageUploadService {
    if (!ImageUploadService.instance) {
      ImageUploadService.instance = new ImageUploadService();
    }
    return ImageUploadService.instance;
  }

  /**
   * Initialize the service with configuration
   */
  private async ensureInitialized(): Promise<void> {
    if (this.initialized) return;

    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const apiToken = process.env.CLOUDFLARE_IMAGES_API_TOKEN;
    const apiUrl = process.env.CLOUDFLARE_IMAGES_API_URL;

    if (!accountId || !apiToken) {
      throw new Error(
        'Cloudflare Images configuration missing. Please set CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_IMAGES_API_TOKEN environment variables.'
      );
    }

    this.client = new CloudflareImagesClient(accountId, apiToken, apiUrl);

    // Initialize configuration with default categories
    this.config = {
      accountId,
      apiToken,
      apiUrl,
      categories: new Map(Object.entries(DEFAULT_IMAGE_CATEGORIES)),
      softDeleteRetentionHours: parseInt(
        process.env.CLOUDFLARE_IMAGES_SOFT_DELETE_RETENTION_HOURS || '168'
      )
    };

    this.initialized = true;
    console.log('ImageUploadService initialized successfully');
  }

  /**
   * Upload an image to Cloudflare Images
   */
  async uploadImage(options: UploadImageOptions): Promise<CloudflareImageResponse> {
    await this.ensureInitialized();

    try {
      // Resolve category
      let category: ImageCategory;
      if (typeof options.category === 'string') {
        const categoryConfig = getCategoryConfig(options.category);
        if (!categoryConfig) {
          throw new Error(`Category "${options.category}" not found. Available categories: ${Object.keys(DEFAULT_IMAGE_CATEGORIES).join(', ')}`);
        }
        category = categoryConfig;
      } else {
        category = validateCategory(options.category);
      }

      // Validate file
      let file: File;
      if (options.file instanceof File) {
        file = options.file;
      } else if (Buffer.isBuffer(options.file)) {
        // Convert buffer to File for validation
        const blob = new Blob([options.file], { type: 'image/jpeg' });
        file = new File([blob], 'image.jpg', { type: 'image/jpeg' });
      } else {
        throw new Error('Invalid file format. Expected File or Buffer.');
      }

      // Validate file against category requirements
      const validation = validateFile(file, category);
      if (!validation.isValid) {
        const error: ImageUploadError = {
          success: false,
          error: validation.error || 'Validation failed',
          code: validation.code as any || 'INVALID_FORMAT'
        };
        throw new Error(error.error);
      }

      // Prepare metadata
      const metadata = {
        ...category.customMetadata,
        ...options.metadata,
        category: category.name,
        uploadedAt: new Date().toISOString()
      };

      if (!this.client) {
        throw new Error('Client not initialized');
      }

      // Upload to Cloudflare
      const result = await this.client.uploadImage(options.file, {
        filename: options.metadata?.filename,
        metadata,
        requireSignedURLs: options.requireSignedURLs
      });

      console.log(`Image uploaded successfully: ${result.id}`);
      return result;

    } catch (error) {
      console.error('Image upload error:', error);
      throw error;
    }
  }

  /**
   * Soft delete an image
   */
  async softDeleteImage(imageId: string, deletedBy: string, reason?: string): Promise<void> {
    await this.ensureInitialized();

    try {
      // Check if image exists
      const imageDetails = await this.getImageDetails(imageId);
      if (!imageDetails) {
        throw new Error(`Image with ID "${imageId}" not found`);
      }

      // Mark as soft deleted
      softDeleteManager.markAsDeleted(imageId, deletedBy, reason);
      console.log(`Image ${imageId} soft deleted by ${deletedBy}`);

    } catch (error) {
      console.error('Soft delete error:', error);
      throw error;
    }
  }

  /**
   * Get image details (only if not soft deleted)
   */
  async getImageDetails(imageId: string): Promise<CloudflareImageResponse | null> {
    await this.ensureInitialized();

    try {
      // Check if image is soft deleted
      if (softDeleteManager.isSoftDeleted(imageId)) {
        console.log(`Image ${imageId} is soft deleted`);
        return null;
      }

      if (!this.client) {
        throw new Error('Client not initialized');
      }

      const image = await this.client.getImageDetails(imageId);
      return image;

    } catch (error) {
      console.error('Error fetching image details:', error);
      throw error;
    }
  }

  /**
   * Get image variants
   */
  async getImageVariants(imageId: string, variantNames?: string[]): Promise<string[]> {
    await this.ensureInitialized();

    try {
      const imageDetails = await this.getImageDetails(imageId);
      if (!imageDetails) {
        throw new Error(`Image not found: ${imageId}`);
      }

      if (variantNames) {
        // Return only requested variants
        const baseUrl = `https://imagedelivery.net/${this.config?.accountId}/${imageId}`;
        return variantNames.map(variant => `${baseUrl}/${variant}`);
      }

      return imageDetails.variants;

    } catch (error) {
      console.error('Error getting image variants:', error);
      throw error;
    }
  }

  /**
   * Get category configuration
   */
  getCategoryConfig(categoryName: string): ImageCategory | null {
    return getCategoryConfig(categoryName);
  }

  /**
   * Get all available categories
   */
  getAvailableCategories(): ImageCategory[] {
    return Array.from(DEFAULT_IMAGE_CATEGORIES.values());
  }

  /**
   * Run cleanup job for soft deleted images
   */
  async runCleanupJob(): Promise<number> {
    await this.ensureInitialized();

    if (!this.client) {
      throw new Error('Client not initialized');
    }

    const retentionHours = this.config?.softDeleteRetentionHours || 168;

    return softDeleteManager.runCleanupJob(
      retentionHours,
      async (imageId: string) => {
        try {
          return await this.client!.deleteImage(imageId);
        } catch (error) {
          console.error(`Failed to delete image ${imageId}:`, error);
          return false;
        }
      }
    );
  }

  /**
   * Restore a soft deleted image
   */
  async restoreImage(imageId: string): Promise<boolean> {
    await this.ensureInitialized();

    const restored = softDeleteManager.restoreImage(imageId);
    if (restored) {
      console.log(`Image ${imageId} restored from soft delete`);
    }

    return restored;
  }

  /**
   * Get soft delete statistics
   */
  getSoftDeleteStats() {
    return softDeleteManager.getStats();
  }

  /**
   * Check if an image is soft deleted
   */
  isSoftDeleted(imageId: string): boolean {
    return softDeleteManager.isSoftDeleted(imageId);
  }

  /**
   * Get service configuration
   */
  getConfig(): ImageUploadConfig | null {
    return this.config;
  }
}

// Export singleton instance for easy usage
export const imageService = ImageUploadService.getInstance();

// Also export the class for testing or custom instances
export { ImageUploadService };

// Export all types
export * from './types';
export * from './config';
export { CloudflareImagesClient } from './cloudflare-images';
export { softDeleteManager } from './soft-delete';
export * from './utils';