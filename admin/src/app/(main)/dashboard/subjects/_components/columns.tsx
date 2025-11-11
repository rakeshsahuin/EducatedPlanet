"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Edit, Trash2, Star, BookOpen, GraduationCap } from "lucide-react";
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

import { SubjectTable, SubjectForm } from "./schema";
import { SubjectModal } from "./subject-modal";

const getTypeVariant = (isAcademic: boolean) => {
  return isAcademic ? "default" : "secondary";
};

const getTypeLabel = (isAcademic: boolean) => {
  return isAcademic ? "Academic" : "Non-Academic";
};

const getStatusVariant = (isActive: boolean) => {
  return isActive ? "default" : "secondary";
};

const getDifficultyVariant = (difficulty?: string) => {
  switch (difficulty) {
    case "beginner":
      return "default";
    case "intermediate":
      return "secondary";
    case "advanced":
      return "destructive";
    default:
      return "outline";
  }
};

export const subjectsColumns: ColumnDef<SubjectTable>[] = [
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
    accessorKey: "code",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Code" />
    ),
    cell: ({ row }) => {
      const subject = row.original;
      return (
        <div className="max-w-[100px] font-mono text-sm">
          {subject.code}
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const subject = row.original;
      return (
        <div className="flex items-center gap-2">
          <span className="font-medium">{subject.name}</span>
          {subject.metadata?.popular && (
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "isAcademic",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => {
      const subject = row.original;
      return (
        <div className="flex items-center gap-2">
          <Badge variant={getTypeVariant(subject.isAcademic)}>
            {subject.isAcademic ? <GraduationCap className="h-3 w-3 mr-1" /> : <BookOpen className="h-3 w-3 mr-1" />}
            {getTypeLabel(subject.isAcademic)}
          </Badge>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      if (!value || value.length === 0) return true;
      const isAcademic = row.getValue(id);
      if (value.includes("academic")) return isAcademic === true;
      if (value.includes("non-academic")) return isAcademic === false;
      return true;
    },
  },
  {
    accessorKey: "classIds",
    header: "Classes",
    cell: ({ row }) => {
      const subject = row.original;
      const classCount = subject.classIds?.length || 0;

      return (
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            {classCount} {classCount === 1 ? 'class' : 'classes'}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "keywords",
    header: "Keywords",
    cell: ({ row }) => {
      const subject = row.original;
      const keywords = subject.keywords || [];

      if (keywords.length === 0) {
        return <span className="text-muted-foreground text-sm">None</span>;
      }

      return (
        <div className="flex flex-wrap gap-1 max-w-[300px]">
          {keywords.slice(0, 3).map((keyword, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {keyword}
            </Badge>
          ))}
          {keywords.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{keywords.length - 3} more
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "metadata.difficulty",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Difficulty" />
    ),
    cell: ({ row }) => {
      const subject = row.original;
      const difficulty = subject.metadata?.difficulty;

      if (!difficulty) {
        return <span className="text-muted-foreground text-sm">Not set</span>;
      }

      return (
        <Badge variant={getDifficultyVariant(difficulty)}>
          {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      if (!value || value.length === 0) return true;
      const difficulty = row.getValue(id);
      return value.includes(difficulty);
    },
  },
  {
    accessorKey: "isActive",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const subject = row.original;
      return (
        <Badge variant={getStatusVariant(subject.isActive)}>
          {subject.isActive ? 'Active' : 'Inactive'}
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
    cell: ({ row, table }) => {
      const subject = row.original;
      const [showDeleteDialog, setShowDeleteDialog] = useState(false);
      const [showEditModal, setShowEditModal] = useState(false);
      const [isDeleting, setIsDeleting] = useState(false);
      const [isToggling, setIsToggling] = useState(false);

      const handleDelete = async () => {
        setIsDeleting(true);
        try {
          const response = await fetch(`/api/subjects/${subject.id}`, {
            method: 'DELETE',
          });

          const result = await response.json();

          if (response.ok) {
            toast.success('Subject deleted successfully');
            // Refresh the table
            window.location.reload();
          } else {
            toast.error(result.error || 'Failed to delete subject');
          }
        } catch (error) {
          toast.error('An error occurred while deleting the subject');
        } finally {
          setIsDeleting(false);
          setShowDeleteDialog(false);
        }
      };

      const handleToggleStatus = async () => {
        setIsToggling(true);
        try {
          const response = await fetch(`/api/subjects/${subject.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              isActive: !subject.isActive
            }),
          });

          const result = await response.json();

          if (response.ok) {
            toast.success(`Subject ${!subject.isActive ? 'activated' : 'deactivated'} successfully`);
            window.location.reload();
          } else {
            toast.error(result.error || 'Failed to update subject');
          }
        } catch (error) {
          toast.error('An error occurred while updating the subject');
        } finally {
          setIsToggling(false);
        }
      };

      const handleTogglePopular = async () => {
        try {
          const response = await fetch(`/api/subjects/${subject.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              metadata: {
                ...subject.metadata,
                popular: !subject.metadata?.popular
              }
            }),
          });

          const result = await response.json();

          if (response.ok) {
            toast.success(`Subject ${!subject.metadata?.popular ? 'marked as' : 'unmarked as'} popular`);
            window.location.reload();
          } else {
            toast.error(result.error || 'Failed to update subject');
          }
        } catch (error) {
          toast.error('An error occurred while updating the subject');
        }
      };

      const handleEditSubmit = async (data: SubjectForm) => {
        try {
          const response = await fetch(`/api/subjects/${subject.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });

          const result = await response.json();

          if (response.ok) {
            toast.success('Subject updated successfully');
            setShowEditModal(false);
            window.location.reload();
          } else {
            toast.error(result.error || 'Failed to update subject');
          }
        } catch (error) {
          toast.error('An error occurred while updating the subject');
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
                onClick={() => setShowEditModal(true)}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleToggleStatus} disabled={isToggling}>
                {subject.isActive ? (
                  <>
                    <GraduationCap className="mr-2 h-4 w-4" />
                    Deactivate
                  </>
                ) : (
                  <>
                    <GraduationCap className="mr-2 h-4 w-4" />
                    Activate
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleTogglePopular}>
                <Star className="mr-2 h-4 w-4" />
                {subject.metadata?.popular ? 'Unmark as Popular' : 'Mark as Popular'}
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

          {/* Edit Modal */}
          <SubjectModal
            mode="edit"
            subject={subject}
            onSubmit={handleEditSubmit}
            onClose={() => setShowEditModal(false)}
          />

          <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the subject "{subject.name}".
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      );
    },
  },
];