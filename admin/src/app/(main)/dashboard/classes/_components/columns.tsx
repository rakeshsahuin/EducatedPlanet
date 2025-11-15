"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Edit, Trash2, Plus, BookOpen } from "lucide-react";
import { format } from "date-fns";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { toast } from "sonner";

import { ClassTable, ClassForm } from "./schema";
import { ClassCategory } from "@educatedplanet/models";
import { ClassModal } from "./class-modal";

// Category helpers
const getCategoryVariant = (category: ClassCategory) => {
  switch (category) {
    case ClassCategory.SCHOOL:
      return "default";
    case ClassCategory.COLLEGE:
      return "secondary";
    case ClassCategory.PROFESSIONAL:
      return "outline";
    case ClassCategory.COMPETITIVE:
      return "destructive";
    case ClassCategory.SKILL_DEVELOPMENT:
      return "default";
    case ClassCategory.SPORTS:
      return "secondary";
    case ClassCategory.ENTERTAINMENT:
      return "outline";
    case ClassCategory.ART:
      return "destructive";
    case ClassCategory.HEALTH:
      return "default";
    default:
      return "outline";
  }
};

const getCategoryLabel = (category: ClassCategory) => {
  return category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

const getStatusVariant = (isActive: boolean) => {
  return isActive ? "default" : "secondary";
};

export const classesColumns: ColumnDef<ClassTable>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const classItem = row.original;
      return (
        <div className="font-medium">
          {classItem.name}
        </div>
      );
    },
  },
  {
    accessorKey: "code",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Code" />
    ),
    cell: ({ row }) => {
      const classItem = row.original;
      return (
        <div className="max-w-[100px] truncate">
          {classItem.code}
        </div>
      );
    },
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => {
      const classItem = row.original;
      return (
        <Badge variant={getCategoryVariant(classItem.category)}>
          {getCategoryLabel(classItem.category)}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "subClasses",
    header: "Sub-classes",
    cell: ({ row }) => {
      const classItem = row.original;
      const hasSubClasses = classItem.subClasses && classItem.subClasses.length > 0;

      if (!hasSubClasses) {
        return <span className="text-muted-foreground">None</span>;
      }

      return (
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            {classItem.subClasses.length} {classItem.subClasses.length === 1 ? 'item' : 'items'}
          </Badge>
          <div className="hidden md:flex max-w-[200px] truncate">
            {classItem.subClasses.slice(0, 2).join(', ')}
            {classItem.subClasses.length > 2 && (
              <span className="text-muted-foreground"> +{classItem.subClasses.length - 2} more</span>
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "metadata",
    header: "Details",
    cell: ({ row }) => {
      const classItem = row.original;
      const metadata = classItem.metadata || {};

      return (
        <div className="space-y-1 text-sm">
          {metadata.minAge && (
            <div className="text-muted-foreground">
              Age: {metadata.minAge}{metadata.maxAge ? ` - ${metadata.maxAge}` : '+'}
            </div>
          )}
          {metadata.duration && (
            <div className="text-muted-foreground">
              Duration: {metadata.duration}
            </div>
          )}
          {metadata.subjects && metadata.subjects.length > 0 && (
            <div className="text-muted-foreground hidden lg:block">
              Subjects: {metadata.subjects.slice(0, 2).join(', ')}
              {metadata.subjects.length > 2 && (
                <span> +{metadata.subjects.length - 2} more</span>
              )}
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "isActive",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const classItem = row.original;
      return (
        <Badge variant={getStatusVariant(classItem.isActive)}>
          {classItem.isActive ? 'Active' : 'Inactive'}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      if (!value || value.length === 0) return true;
      const isActive = row.getValue(id);
      if (value.includes("active")) return isActive === true;
      if (value.includes("inactive")) return isActive === false;
      return true;
    },
  },
  {
    accessorKey: "sortOrder",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Order" />
    ),
    cell: ({ row }) => {
      return (
        <div className="text-center">
          {row.getValue("sortOrder")}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as Date;
      return (
        <div className="text-sm text-muted-foreground">
          {format(date, "MMM dd, yyyy")}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const classItem = row.original;
      const [showDeleteDialog, setShowDeleteDialog] = useState(false);
      const [showEditModal, setShowEditModal] = useState(false);
      const [editingClass, setEditingClass] = useState(null);
      const [isDeleting, setIsDeleting] = useState(false);
      const [isLoadingClass, setIsLoadingClass] = useState(false);

      const handleDelete = async () => {
        setIsDeleting(true);
        try {
          const response = await fetch(`/api/classes/${classItem.id}`, {
            method: 'DELETE',
          });

          const result = await response.json();

          if (response.ok) {
            toast.success('Class deleted successfully');
            // Trigger table refresh
            window.dispatchEvent(new CustomEvent('refreshClassesTable'));
          } else {
            toast.error(result.error || 'Failed to delete class');
          }
        } catch (error) {
          toast.error('An error occurred while deleting the class');
        } finally {
          setIsDeleting(false);
          setShowDeleteDialog(false);
        }
      };

      const handleEditClick = async () => {
        setIsLoadingClass(true);
        try {
          const response = await fetch(`/api/classes/${classItem.id}`);
          const result = await response.json();

          if (response.ok && result.success) {
            setEditingClass(result.data);
            setShowEditModal(true);
          } else {
            toast.error(result.error || 'Failed to fetch class details');
          }
        } catch (error) {
          toast.error('An error occurred while fetching class details');
        } finally {
          setIsLoadingClass(false);
        }
      };

      const handleEditSubmit = async (data: ClassForm) => {
        try {
          const response = await fetch(`/api/classes/${classItem.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });

          const result = await response.json();

          if (response.ok) {
            toast.success('Class updated successfully');
            setShowEditModal(false);
            // Trigger table refresh
            window.dispatchEvent(new CustomEvent('refreshClassesTable'));
          } else {
            toast.error(result.error || 'Failed to update class');
          }
        } catch (error) {
          toast.error('An error occurred while updating the class');
        }
      };

      const handleToggleStatus = async () => {
        try {
          const response = await fetch(`/api/classes/${classItem.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              isActive: !classItem.isActive
            }),
          });

          const result = await response.json();

          if (response.ok) {
            toast.success(`Class ${!classItem.isActive ? 'activated' : 'deactivated'} successfully`);
            // Trigger table refresh
            window.dispatchEvent(new CustomEvent('refreshClassesTable'));
          } else {
            toast.error(result.error || 'Failed to update class');
          }
        } catch (error) {
          toast.error('An error occurred while updating the class');
        }
      };

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={handleEditClick}
                disabled={isLoadingClass}
              >
                <Edit className="mr-2 h-4 w-4" />
                {isLoadingClass ? 'Loading...' : 'Edit'}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleToggleStatus}
              >
                {classItem.isActive ? (
                  <>
                    <BookOpen className="mr-2 h-4 w-4" />
                    Deactivate
                  </>
                ) : (
                  <>
                    <BookOpen className="mr-2 h-4 w-4" />
                    Activate
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setShowDeleteDialog(true)}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the class "{classItem.name}".
                  {classItem.subClasses && classItem.subClasses.length > 0 && (
                    <span className="block mt-2 text-orange-600">
                      Note: This class has {classItem.subClasses.length} sub-class(es) that might be referenced elsewhere.
                    </span>
                  )}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Edit Modal */}
          {showEditModal && (
            <ClassModal
              mode="edit"
              class={editingClass}
              onSubmit={handleEditSubmit}
              onClose={() => setShowEditModal(false)}
            />
          )}
        </>
      );
    },
  },
];