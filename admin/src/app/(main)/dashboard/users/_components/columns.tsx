"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Edit, Trash2, Eye, UserCheck, UserX } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

import { UserTable, UserForm } from "./schema";
import { UserModal } from "./user-modal";
import type { User } from "@educatedplanet/models";

const getRoleVariant = (role: string) => {
  switch (role) {
    case "admin":
      return "destructive";
    case "sub-admin":
      return "outline";
    case "tutor":
      return "default";
    case "user":
      return "secondary";
    default:
      return "outline";
  }
};

const getRoleLabel = (role: string) => {
  switch (role) {
    case "admin":
      return "Admin";
    case "sub-admin":
      return "Sub-Admin";
    case "tutor":
      return "Tutor";
    case "user":
      return "User";
    default:
      return role;
  }
};

export const usersColumns: ColumnDef<UserTable>[] = [
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
      const user = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>
              {user.name.split(" ").map(n => n[0]).join("").toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">{user.name}</span>
            {user.email && (
              <span className="text-sm text-muted-foreground">{user.email}</span>
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone" />
    ),
    cell: ({ row }) => <span className="text-sm">{row.original.phone}</span>,
  },
  {
    accessorKey: "gender",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Gender" />
    ),
    cell: ({ row }) => {
      const gender = row.original.profile?.gender;
      return gender ? (
        <Badge variant="secondary" className="capitalize">
          {gender}
        </Badge>
      ) : (
        <span className="text-muted-foreground">-</span>
      );
    },
    filterFn: (row, id, value) => {
      const gender = row.original.profile?.gender;
      return value.includes(gender);
    },
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => (
      <Badge variant={getRoleVariant(row.original.role)}>
        {getRoleLabel(row.original.role)}
      </Badge>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "verificationStatus",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Verification Status" />
    ),
    cell: ({ row }) => {
      const { isEmailVerified, isPhoneVerified } = row.original;
      return (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isEmailVerified ? 'bg-green-600' : 'bg-orange-600'}`} />
            <span className={`text-xs ${isEmailVerified ? 'text-green-600' : 'text-orange-600'}`}>
              Email {isEmailVerified ? 'Verified' : 'Not Verified'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isPhoneVerified ? 'bg-green-600' : 'bg-orange-600'}`} />
            <span className={`text-xs ${isPhoneVerified ? 'text-green-600' : 'text-orange-600'}`}>
              Phone {isPhoneVerified ? 'Verified' : 'Not Verified'}
            </span>
          </div>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      if (value === "all") return true;
      if (value === "verified") return row.original.isEmailVerified && row.original.isPhoneVerified;
      if (value === "partial") return row.original.isEmailVerified || row.original.isPhoneVerified;
      return true;
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Joined Date" />
    ),
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {format(new Date(row.original.createdAt), "MMM dd, yyyy")}
      </span>
    ),
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Updated" />
    ),
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {format(new Date(row.original.updatedAt), "MMM dd, yyyy")}
      </span>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const user = row.original;
      const [showDeleteDialog, setShowDeleteDialog] = useState(false);
      const [showEditModal, setShowEditModal] = useState(false);
      const [editingUser, setEditingUser] = useState<User | null>(null);
      const [isDeleting, setIsDeleting] = useState(false);
      const [isLoadingUser, setIsLoadingUser] = useState(false);

      const handleDelete = async () => {
        setIsDeleting(true);
        try {
          const response = await fetch(`/api/users/${user.id}`, {
            method: 'DELETE',
          });

          const result = await response.json();

          if (response.ok) {
            toast.success('User deleted successfully');
            // Trigger table refresh
            window.dispatchEvent(new CustomEvent('refreshUsersTable'));
          } else {
            toast.error(result.error || 'Failed to delete user');
          }
        } catch (error) {
          toast.error('An error occurred while deleting the user');
        } finally {
          setIsDeleting(false);
          setShowDeleteDialog(false);
        }
      };

      const handleEditClick = async () => {
        setIsLoadingUser(true);
        try {
          const response = await fetch(`/api/users/${user.id}`);
          const result = await response.json();

          if (response.ok && result.success) {
            setEditingUser(result.data);
            setShowEditModal(true);
          } else {
            toast.error(result.error || 'Failed to fetch user details');
          }
        } catch (error) {
          toast.error('An error occurred while fetching user details');
        } finally {
          setIsLoadingUser(false);
        }
      };

      const handleEditSubmit = async (data: UserForm) => {
        try {
          const response = await fetch(`/api/users/${user.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });

          const result = await response.json();

          if (response.ok) {
            toast.success('User updated successfully');
            setShowEditModal(false);
            // Trigger table refresh
            window.dispatchEvent(new CustomEvent('refreshUsersTable'));
          } else {
            toast.error(result.error || 'Failed to update user');
          }
        } catch (error) {
          toast.error('An error occurred while updating the user');
        }
      };

      const handleToggleVerification = async () => {
        try {

          const response = await fetch(`/api/users/${user.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              isEmailVerified: !user.isEmailVerified,
              isPhoneVerified: !user.isPhoneVerified
            }),
          });

          const result = await response.json();

          if (response.ok) {
            toast.success(`User verification updated successfully`);
            window.dispatchEvent(new CustomEvent('refreshUsersTable'));
          } else {
            toast.error(result.error || 'Failed to update user');
          }
        } catch (error) {
          toast.error('An error occurred while updating the user');
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
                onClick={() => navigator.clipboard.writeText(user.id)}
              >
                <Eye className="mr-2 h-4 w-4" />
                Copy user ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleEditClick}
                disabled={isLoadingUser}
              >
                <Edit className="mr-2 h-4 w-4" />
                {isLoadingUser ? 'Loading...' : 'Edit user'}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleToggleVerification}
              >
                {user.isEmailVerified && user.isPhoneVerified ? (
                  <>
                    <UserX className="mr-2 h-4 w-4" />
                    Unverify user
                  </>
                ) : (
                  <>
                    <UserCheck className="mr-2 h-4 w-4" />
                    Verify user
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setShowDeleteDialog(true)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete user
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the user "{user.name}".
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
            <UserModal
              mode="edit"
              user={editingUser!}
              onSubmit={handleEditSubmit}
              onClose={() => setShowEditModal(false)}
            />
          )}
        </>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];