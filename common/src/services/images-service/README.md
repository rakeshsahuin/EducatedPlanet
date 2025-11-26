# Cloudflare Images Upload Service

A reusable image upload service for EducatedPlanet platform that integrates with Cloudflare Images API.

## Features

- **Category-based uploads** with different size limits and allowed file types
- **Unique filename generation** using UUID and timestamp
- **Soft delete functionality** with automatic cleanup jobs
- **Metadata management** with sanitization
- **Variant URL generation** for different image sizes
- **TypeScript support** with full type safety
- **Error handling** with detailed error codes

## Installation

The service is part of the `@educatedplanet/common` package. Make sure you have the dependencies installed:

```bash
npm install uuid @types/uuid
```

## Environment Configuration

Add the following environment variables to your `.env.local` file:

```env
# Cloudflare Images Configuration
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_IMAGES_API_TOKEN=your_api_token

# Optional: Custom API URL
# CLOUDFLARE_IMAGES_API_URL=https://api.cloudflare.com/client/v4/accounts/<ACCOUNT_ID>/images/v1

# Soft delete cleanup configuration (in hours)
CLOUDFLARE_IMAGES_SOFT_DELETE_RETENTION_HOURS=168  # 7 days
```

## Usage

### Basic Upload

```typescript
import { imageService } from '@educatedplanet/common';

// Upload a tutor photo
const result = await imageService.uploadImage({
  file: imageFile,
  category: 'tutor-photo',
  metadata: {
    tutorId: 'tutor-123',
    uploadedBy: 'admin'
  }
});

console.log(result.variants);
// [
//   "https://imagedelivery.net/account/imageId/public",
//   "https://imagedelivery.net/account/imageId/thumbnail",
//   "https://imagedelivery.net/account/imageId/card"
// ]
```

### Custom Category

```typescript
const result = await imageService.uploadImage({
  file: imageFile,
  category: {
    name: 'custom-category',
    maxFileSize: 20,
    allowedTypes: ['image/jpeg', 'image/png'],
    variants: ['public', 'large', 'medium', 'small'],
    customMetadata: { type: 'banner' }
  }
});
```

### Soft Delete

```typescript
// Soft delete an image
await imageService.softDeleteImage('imageId', 'admin-123', 'Tutor left platform');

// Check if image is soft deleted
const isDeleted = imageService.isSoftDeleted('imageId');

// Restore a soft-deleted image
const restored = await imageService.restoreImage('imageId');

// Run cleanup job (can be scheduled as cron job)
const deletedCount = await imageService.runCleanupJob();
```

### Get Image Details

```typescript
// Get image details (only if not soft deleted)
const image = await imageService.getImageDetails('imageId');

// Get specific variants
const variants = await imageService.getImageVariants('imageId', ['thumbnail', 'card']);
```

## Predefined Categories

### Tutor Photo
- Name: `tutor-photo`
- Max size: 5MB
- Allowed types: `image/jpeg`, `image/png`, `image/webp`
- Variants: `public`, `thumbnail`, `card`

### Class Image
- Name: `class-image`
- Max size: 10MB
- Allowed types: `image/jpeg`, `image/png`, `image/webp`
- Variants: `public`, `banner`, `thumbnail`

### Profile Picture
- Name: `profile-picture`
- Max size: 2MB
- Allowed types: `image/jpeg`, `image/png`, `image/webp`
- Variants: `public`, `avatar`, `thumbnail`

## API Endpoints

### Admin App

#### Upload Image
```
POST /api/upload/image
Content-Type: multipart/form-data

Body:
- image: File (required)
- category: string (required)
- tutorId?: string
- classId?: string
- requireSignedURLs?: boolean
```

#### Get Upload Info
```
GET /api/upload/image

Response:
{
  success: true,
  data: {
    categories: [...],
    softDeleteRetentionHours: 168
  }
}
```

#### Soft Delete Image
```
DELETE /api/upload/image?imageId=xxx&reason=Tutor left platform
```

#### Restore Image
```
POST /api/upload/restore
Body: { imageId: string }
```

#### Run Cleanup Job
```
POST /api/upload/cleanup

Response:
{
  success: true,
  data: { deletedCount: 5 }
}
```

#### Get Cleanup Stats
```
GET /api/upload/cleanup

Response:
{
  success: true,
  data: {
    total: 10,
    byDeleter: { 'admin-123': 7, 'admin-456': 3 },
    oldestDeletion: '2024-01-01T00:00:00Z',
    newestDeletion: '2024-01-15T12:00:00Z'
  }
}
```

## Error Handling

The service provides detailed error information:

```typescript
interface ImageUploadError {
  success: false;
  error: string;
  code: 'FILE_TOO_LARGE' | 'INVALID_FORMAT' | 'UPLOAD_FAILED' | 'API_ERROR' | 'CATEGORY_NOT_FOUND';
  details?: any;
}
```

## Best Practices

1. **Always validate files on the client side** before sending to the server
2. **Use appropriate categories** for different types of images
3. **Include relevant metadata** for better organization
4. **Schedule cleanup jobs** regularly to free up storage
5. **Handle soft-deleted images** appropriately in your UI
6. **Use variant URLs** for optimal image display

## Security Considerations

- All API endpoints require admin authentication
- Metadata is sanitized to prevent XSS attacks
- File types are validated both on client and server
- File sizes are enforced per category
- Rate limiting should be implemented on API routes

## Testing

The service includes comprehensive type definitions for easy testing:

```typescript
import { ImageUploadService, CloudflareImagesClient } from '@educatedplanet/common';

// Mock the client for testing
const mockClient = new CloudflareImagesClient('test-account', 'test-token');
const service = ImageUploadService.getInstance();
```