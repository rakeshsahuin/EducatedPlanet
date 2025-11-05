"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Edit, Trash2, Eye, UserCheck, UserX } from "lucide-react";
import { format } from "date-fns";

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

import { UserTable } from "./schema";

const getRoleVariant = (role: string) => {
  switch (role) {
    case "admin":
      return "destructive";
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
    accessorKey: "isVerified",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        {row.original.isVerified ? (
          <>
            <UserCheck className="h-4 w-4 text-green-600" />
            <span className="text-sm text-green-600">Verified</span>
          </>
        ) : (
          <>
            <UserX className="h-4 w-4 text-orange-600" />
            <span className="text-sm text-orange-600">Not Verified</span>
          </>
        )}
      </div>
    ),
    filterFn: (row, id, value) => {
      if (value === "all") return true;
      return value === "verified" ? row.original.isVerified : !row.original.isVerified;
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

      return (
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
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" />
              Edit user
            </DropdownMenuItem>
            <DropdownMenuItem>
              {user.isVerified ? (
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
            <DropdownMenuItem className="text-destructive focus:text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete user
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];