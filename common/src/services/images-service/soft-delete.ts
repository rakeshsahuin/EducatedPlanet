import { SoftDeleteImage } from './types';

/**
 * In-memory storage for soft-deleted images
 * In production, this should be replaced with a persistent storage like Redis or database
 */
class SoftDeleteManager {
  private deletedImages: Map<string, SoftDeleteImage> = new Map();

  /**
   * Mark an image as soft deleted
   */
  markAsDeleted(imageId: string, deletedBy: string, reason?: string): void {
    const deleteRecord: SoftDeleteImage = {
      imageId,
      deletedAt: new Date(),
      deletedBy,
      reason
    };

    this.deletedImages.set(imageId, deleteRecord);
    console.log(`Image ${imageId} marked as soft deleted by ${deletedBy}`);
  }

  /**
   * Check if an image is soft deleted
   */
  isSoftDeleted(imageId: string): boolean {
    return this.deletedImages.has(imageId);
  }

  /**
   * Get soft delete information for an image
   */
  getDeleteInfo(imageId: string): SoftDeleteImage | null {
    return this.deletedImages.get(imageId) || null;
  }

  /**
   * Get all soft deleted images
   */
  getDeletedImages(): SoftDeleteImage[] {
    return Array.from(this.deletedImages.values());
  }

  /**
   * Remove an image from soft delete tracking (after permanent deletion)
   */
  removeDeletedImage(imageId: string): void {
    this.deletedImages.delete(imageId);
  }

  /**
   * Run cleanup job to permanently delete images past retention period
   * Returns the number of images that were permanently deleted
   */
  async runCleanupJob(
    retentionHours: number = 168, // 7 days default
    permanentDeleteFn: (imageId: string) => Promise<boolean> = async () => true
  ): Promise<number> {
    const now = new Date();
    const retentionMs = retentionHours * 60 * 60 * 1000;
    const imagesToDelete: string[] = [];

    // Find images past retention period
    for (const [imageId, deleteInfo] of this.deletedImages.entries()) {
      const timeSinceDeletion = now.getTime() - deleteInfo.deletedAt.getTime();

      if (timeSinceDeletion > retentionMs) {
        imagesToDelete.push(imageId);
      }
    }

    // Permanently delete images
    let deletedCount = 0;
    for (const imageId of imagesToDelete) {
      try {
        const success = await permanentDeleteFn(imageId);
        if (success) {
          this.removeDeletedImage(imageId);
          deletedCount++;
          console.log(`Permanently deleted image: ${imageId}`);
        } else {
          console.warn(`Failed to permanently delete image: ${imageId}`);
        }
      } catch (error) {
        console.error(`Error permanently deleting image ${imageId}:`, error);
      }
    }

    if (deletedCount > 0) {
      console.log(`Cleanup job completed. Deleted ${deletedCount} images.`);
    }

    return deletedCount;
  }

  /**
   * Restore a soft deleted image
   */
  restoreImage(imageId: string): boolean {
    const wasDeleted = this.deletedImages.has(imageId);
    if (wasDeleted) {
      this.deletedImages.delete(imageId);
      console.log(`Image ${imageId} restored from soft delete`);
    }
    return wasDeleted;
  }

  /**
   * Get statistics about soft deleted images
   */
  getStats(): {
    total: number;
    byDeleter: Record<string, number>;
    oldestDeletion: Date | null;
    newestDeletion: Date | null;
  } {
    const deleted = this.getDeletedImages();
    const byDeleter: Record<string, number> = {};

    let oldestDeletion: Date | null = null;
    let newestDeletion: Date | null = null;

    deleted.forEach(info => {
      // Count by deleter
      byDeleter[info.deletedBy] = (byDeleter[info.deletedBy] || 0) + 1;

      // Track oldest and newest
      if (!oldestDeletion || info.deletedAt < oldestDeletion) {
        oldestDeletion = info.deletedAt;
      }
      if (!newestDeletion || info.deletedAt > newestDeletion) {
        newestDeletion = info.deletedAt;
      }
    });

    return {
      total: deleted.length,
      byDeleter,
      oldestDeletion,
      newestDeletion
    };
  }
}

// Export singleton instance
export const softDeleteManager = new SoftDeleteManager();