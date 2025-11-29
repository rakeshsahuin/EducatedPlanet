"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import {
  GripVertical,
  Trash2,
  Eye,
  Plus,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { PhotoData } from "@educatedplanet/models";
import { cn } from "@/lib/utils";

interface SortableImageCardProps {
  image: PhotoData;
  index: number;
  onPreview: (index: number) => void;
  onDelete: (index: number) => void;
}

function SortableImageCard({
  image,
  index,
  onPreview,
  onDelete,
}: SortableImageCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative group aspect-auto overflow-hidden rounded-lg border bg-background",
        isDragging && "opacity-50"
      )}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 left-2 z-10 cursor-grab active:cursor-grabbing bg-black/50 text-white rounded p-1 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <GripVertical className="h-4 w-4" />
      </div>

      {/* Image */}
      <img
        key={`img-${image.id}-${Date.now()}`} // Force re-render with timestamp
        src={image.url}
        alt={image.filename || `Gallery image ${index + 1}`}
        className="w-full h-full object-cover"
        onClick={() => onPreview(index)}
        onLoad={(e) => {
          // Force re-render if image loads
          console.log(`Image loaded: ${image.id}`, { url: image.url.substring(0, 50) + '...' });
          e.currentTarget.style.opacity = '1';
        }}
        onError={(e) => {
          // Handle error
          console.error('Image load error:', e);
        }}
        style={{ opacity: '1' }}
        crossOrigin="anonymous"
      />

      {/* Overlay Actions */}
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onPreview(index)}
          className="bg-white/20 hover:bg-white/30 text-white"
        >
          <Eye className="h-4 w-4" />
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="secondary"
              size="sm"
              className="bg-white/20 hover:bg-red-500/30 text-white"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Image</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{image.filename}"? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDelete(index)}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Image Info Badge */}
      <div className="absolute bottom-2 right-2">
        <Badge variant="secondary" className="text-xs bg-black/50 text-white">
          {index + 1}
        </Badge>
      </div>
    </div>
  );
}

interface GalleryGridProps {
  images: PhotoData[];
  onReorder: (oldIndex: number, newIndex: number) => void;
  onPreview: (index: number) => void;
  onDelete: (index: number) => void;
  onAddMore?: () => void;
  maxImages?: number;
  disabled?: boolean;
}

export function GalleryGrid({
  images,
  onReorder,
  onPreview,
  onDelete,
  onAddMore,
  maxImages = 20,
  disabled = false,
}: GalleryGridProps) {
  // Debug: Log when images prop changes
  console.log('GalleryGrid: images prop updated', {
    imageCount: images.length,
    imageIds: images.map(img => img.id),
    imageUrls: images.map(img => img.url.substring(0, 50) + '...')
  });
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: any) {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = images.findIndex((image) => image.id === active.id);
      const newIndex = images.findIndex((image) => image.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        onReorder(oldIndex, newIndex);
      }
    }
  }

  if (images.length === 0 && !onAddMore) {
    return (
      <Card>
        <CardContent className="p-12">
          <div className="text-center text-muted-foreground">
            <ImageIcon className="mx-auto h-12 w-12 mb-4" />
            <p>No images in gallery</p>
            <p className="text-sm">Add images to get started</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={images.map((img) => img.id)} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {/* Render Images */}
          {images.map((image, index) => {
            console.log(`GalleryGrid: Rendering image ${index}`, {
              id: image.id,
              url: image.url.substring(0, 50) + '...',
              key: `${image.id}-${index}`
            });
            return (
              <SortableImageCard
                key={`${image.id}-${index}`}
                image={image}
                index={index}
                onPreview={onPreview}
                onDelete={onDelete}
              />
            );
          })}

          {/* Add More Button */}
          {onAddMore && images.length < maxImages && (
            <Card
              className={cn(
                "border-dashed border-2 flex items-center justify-center cursor-pointer hover:border-primary transition-colors aspect-auto",
                disabled && "opacity-50 cursor-not-allowed"
              )}
              onClick={() => !disabled && onAddMore()}
            >
              <CardContent className="p-4 text-center">
                <Plus className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Add More Images
                </p>
                <p className="text-xs text-muted-foreground">
                  ({maxImages - images.length} slots left)
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </SortableContext>

      {/* Image Count */}
      <div className="mt-4 text-sm text-muted-foreground">
        {images.length} of {maxImages} images
      </div>
    </DndContext>
  );
}