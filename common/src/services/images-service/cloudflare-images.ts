import { CloudflareImageResponse, ImageUploadError } from './types';
import { generateUniqueFilename, sanitizeMetadata } from './utils';

export class CloudflareImagesClient {
  private accountId: string;
  private apiToken: string;
  private apiUrl: string;

  constructor(accountId: string, apiToken: string, apiUrl?: string) {
    this.accountId = accountId;
    this.apiToken = apiToken;
    this.apiUrl = apiUrl || `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1`;
  }

  /**
   * Upload an image to Cloudflare Images
   */
  async uploadImage(
    file: File | Buffer,
    options: {
      filename?: string;
      metadata?: Record<string, any>;
      requireSignedURLs?: boolean;
    } = {}
  ): Promise<CloudflareImageResponse> {
    try {
      const formData = new FormData();

      // Handle file input
      if (file instanceof File) {
        formData.append('file', file);
      } else if (Buffer.isBuffer(file)) {
        // For buffer, we need to create a File-like object
        const blob = new Blob([file]);
        formData.append('file', blob, options.filename || generateUniqueFilename());
      } else {
        throw new Error('Invalid file format');
      }

      // Add optional parameters
      if (options.requireSignedURLs !== undefined) {
        formData.append('requireSignedURLs', options.requireSignedURLs.toString());
      }

      // Sanitize and add metadata
      if (options.metadata) {
        const sanitizedMetadata = sanitizeMetadata(options.metadata);
        formData.append('metadata', JSON.stringify(sanitizedMetadata));
      }

      const response = await fetch(`${this.apiUrl}/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.errors?.[0]?.message ||
          `Cloudflare API error: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.errors?.[0]?.message || 'Upload failed');
      }

      return this.transformCloudflareResponse(data.result);

    } catch (error) {
      console.error('Cloudflare Images upload error:', error);

      // Re-throw with more context
      if (error instanceof Error) {
        throw new Error(`Image upload failed: ${error.message}`);
      }

      throw new Error('Unknown error occurred during image upload');
    }
  }

  /**
   * Get image details from Cloudflare Images
   */
  async getImageDetails(imageId: string): Promise<CloudflareImageResponse | null> {
    try {
      const response = await fetch(`${this.apiUrl}/${imageId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Failed to fetch image details: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.errors?.[0]?.message || 'Failed to fetch image');
      }

      return this.transformCloudflareResponse(data.result);

    } catch (error) {
      console.error('Error fetching image details:', error);
      throw error;
    }
  }

  /**
   * Delete an image from Cloudflare Images
   */
  async deleteImage(imageId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/${imageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          // Image doesn't exist, consider it deleted
          return true;
        }
        throw new Error(`Failed to delete image: ${response.status}`);
      }

      const data = await response.json();
      return data.success;

    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  }

  /**
   * List images with optional filtering
   */
  async listImages(options: {
    page?: number;
    per_page?: number;
    sort?: 'created_at' | 'size';
    direction?: 'asc' | 'desc';
  } = {}): Promise<{ images: CloudflareImageResponse[], total: number }> {
    try {
      const params = new URLSearchParams();

      if (options.page) params.append('page', options.page.toString());
      if (options.per_page) params.append('per_page', options.per_page.toString());
      if (options.sort) params.append('sort', options.sort);
      if (options.direction) params.append('direction', options.direction);

      const response = await fetch(`${this.apiUrl}?${params}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to list images: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.errors?.[0]?.message || 'Failed to list images');
      }

      const images = data.result.images.map((img: any) => this.transformCloudflareResponse(img));

      return {
        images,
        total: data.result.image_info.total
      };

    } catch (error) {
      console.error('Error listing images:', error);
      throw error;
    }
  }

  /**
   * Transform Cloudflare API response to our format
   */
  private transformCloudflareResponse(cloudflareResult: any): CloudflareImageResponse {
    return {
      id: cloudflareResult.id,
      filename: cloudflareResult.filename || cloudflareResult.id,
      metadata: cloudflareResult.metadata || {},
      uploaded: cloudflareResult.uploaded || new Date().toISOString(),
      requireSignedURLs: cloudflareResult.requireSignedURLs || false,
      variants: cloudflareResult.variants || []
    };
  }
}