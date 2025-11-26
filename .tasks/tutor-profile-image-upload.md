# Tutor Profile Image Upload Implementation Plan

## Overview
Integrate the Cloudflare image upload service into the tutor creation form with modal-based upload and cropping functionality.

## Current Status
-  Cloudflare image upload service is fully implemented in `common/src/services/images-service/`
-  Admin API endpoints are available at `/api/upload/image`
- L Build failing due to missing `uuid` dependency (run `pnpm install`)

## Requirements
1. Add image upload section to "Basic Info" tab in tutor form
2. Use a modal for image upload with cropping capability
3. When "create tutor" is clicked, upload image to Cloudflare and save result object to tutor document
4. Use existing UI components (Dialog, Avatar, Button, Form)

## Implementation Plan

### 1. Architecture Overview
- **Upload Timing**: Upload during form submission (not immediately) to prevent orphaned images
- **Image Cropping**: Use `react-easy-crop` library for lightweight, touch-friendly cropping
- **Storage Format**: Store Cloudflare response object in tutor document's `basicInfo.photo` field
- **UI Pattern**: Modal-based upload with avatar preview in form

### 2. Components to Create

#### A. ImageUploadModal Component
- **Location**: `admin/src/components/forms/ImageUploadModal.tsx`
- **Features**:
  - Drag-and-drop file upload zone
  - Image preview with cropping interface
  - 1:1 aspect ratio for profile photos
  - Zoom slider and pan controls
  - File validation (size: 5MB max, types: jpeg/png/webp)
  - Crop preview with real-time updates
- **Dependencies**: `react-easy-crop`
- **Props Interface**:
```typescript
interface ImageUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImageSelect: (file: File, previewUrl: string) => void;
  initialImage?: string;
}
```

#### B. TutorPhotoUpload Component
- **Location**: `admin/src/components/forms/TutorPhotoUpload.tsx`
- **Features**:
  - Large avatar display (120px)
  - Edit button overlay on hover
  - "Change Photo" and "Remove Photo" options
  - Fallback to user initials
  - Disabled state during form submission
- **Props Interface**:
```typescript
interface TutorPhotoUploadProps {
  value?: PhotoData;
  onChange: (photo: PhotoData | undefined) => void;
  disabled?: boolean;
}
```

### 3. Schema Updates

#### PhotoData Type Definition
Add to `models/src/tutor/admin.types.ts`:
```typescript
export interface PhotoData {
  id: string;
  filename: string;
  url: string;
  uploaded: string;
  variants: string[];
  metadata?: Record<string, any>;
}
```

#### Form Schema Updates
Add to `tutorFormSchema` in `admin/src/app/(main)/dashboard/tutors/_components/schema.ts`:
```typescript
photo: z.object({
  id: z.string(),
  filename: z.string(),
  url: z.string().url(),
  uploaded: z.string(),
  variants: z.array(z.string()),
  metadata: z.record(z.any()).optional()
}).optional()
```

### 4. State Management Strategy
In TutorForm component:
```typescript
const [photoFile, setPhotoFile] = useState<File | null>(null);
const [photoPreview, setPhotoPreview] = useState<string>('');
const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
```

**State Flow**:
1. User selects image ’ Store file in `photoFile`, generate preview URL
2. User crops and confirms ’ Keep file reference, update preview
3. Form submission ’ Upload file, get Cloudflare response, include in form data

### 5. API Integration

#### Upload Service Wrapper
Create `admin/src/lib/image-upload.ts`:
```typescript
import { CloudflareImageResponse } from '@educatedplanet/common';

export async function uploadTutorPhoto(
  file: File,
  tutorId?: string
): Promise<{ success: boolean; data?: CloudflareImageResponse; error?: string }> {
  try {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('category', 'tutor-photo');
    formData.append('requireSignedURLs', 'false');

    if (tutorId) {
      formData.append('tutorId', tutorId);
    }

    const response = await fetch('/api/upload/image', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      return { success: false, error: result.error || 'Upload failed' };
    }

    return { success: true, data: result.data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed'
    };
  }
}
```

#### Form Submission Update
```typescript
const onSubmit = async (data: z.infer<typeof tutorFormSchema>) => {
  setIsLoading(true);

  try {
    // Upload photo first if selected
    let photoData;
    if (photoFile) {
      const uploadResult = await uploadTutorPhoto(photoFile);
      if (!uploadResult.success) {
        toast.error(uploadResult.error || 'Failed to upload photo');
        return;
      }
      photoData = uploadResult.data;
    }

    // Transform and submit form data
    const transformedData = {
      ...data,
      basicInfo: {
        ...data,
        photo: photoData
      }
      // ... other transformations
    };

    const response = await fetch('/api/tutors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(transformedData),
    });

    // Handle response...
  } catch (error) {
    toast.error('Failed to create tutor');
  } finally {
    setIsLoading(false);
  }
};
```

### 6. Form Integration

#### Basic Info Tab Enhancement
Add this section after the name field in `tutor-form.tsx`:
```typescript
<Card>
  <CardHeader>
    <CardTitle>Profile Photo</CardTitle>
    <CardDescription>Add a professional profile photo</CardDescription>
  </CardHeader>
  <CardContent>
    <FormField
      control={form.control}
      name="photo"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <TutorPhotoUpload
              value={field.value}
              onChange={field.onChange}
              disabled={isLoading}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </CardContent>
</Card>
```

### 7. Implementation Steps

1. **Install Dependencies**:
   ```bash
   pnpm --filter admin add react-easy-crop
   ```

2. **Create ImageUploadModal Component**:
   - Implement drag-and-drop zone
   - Integrate react-easy-crop
   - Add crop controls (zoom, pan)
   - Handle file validation

3. **Create TutorPhotoUpload Component**:
   - Use Avatar from Shadcn
   - Add edit/remove buttons
   - Integrate with modal

4. **Update Form Schema**:
   - Add PhotoData type definition
   - Update tutorFormSchema

5. **Integrate with Tutor Form**:
   - Add PhotoUpload to Basic Info tab
   - Wire up form controls
   - Handle state management

6. **Create Upload Service**:
   - Implement API wrapper
   - Add error handling

7. **Update Form Submission**:
   - Upload photo before form submission
   - Handle upload errors
   - Add loading states

8. **Testing & Polish**:
   - Test upload scenarios
   - Add error handling
   - Accessibility checks

### 8. Error Handling Strategy

1. **Client-side Validation**:
   - File type checking
   - File size validation (5MB limit)
   - Image dimension validation

2. **Upload Errors**:
   - Network timeout
   - API rate limits
   - Cloudflare service errors

3. **Form Integration**:
   - Upload failure rollback
   - Preserve form data on upload error
   - User-friendly error messages

### 9. Mobile Considerations

- Touch-friendly crop controls
- Camera capture support
- Responsive modal layout
- Proper viewport handling

### 10. Success Metrics

- Upload success rate: >99%
- Average upload time: <5 seconds
- Form completion rate: Maintain >95%
- Zero orphaned images

## Critical Files for Implementation

1. `admin/src/components/forms/ImageUploadModal.tsx` - New modal component with cropping
2. `admin/src/components/forms/TutorPhotoUpload.tsx` - Photo upload section component
3. `admin/src/app/(main)/dashboard/tutors/_components/schema.ts` - Form schema updates
4. `models/src/tutor/admin.types.ts` - PhotoData type definition
5. `admin/src/lib/image-upload.ts` - API service wrapper
6. `admin/src/app/(main)/dashboard/tutors/_components/tutor-form.tsx` - Integration point

## Immediate Action Required

The build is failing because the `uuid` dependency hasn't been installed in the monorepo.

**Run this command immediately:**
```bash
pnpm install
```

This will install all dependencies across the monorepo including the newly added `uuid` and `@types/uuid` packages in the common package.

## Usage Example
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
// Returns Cloudflare variant URLs
```