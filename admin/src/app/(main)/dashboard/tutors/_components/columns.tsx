"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { ArrowUpDown, MoreHorizontal, Edit, Eye, Star, MapPin, Calendar, CheckCircle, XCircle, Clock, AlertCircle, Crown } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";
import { TutorStatus } from "@educatedplanet/models";

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
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
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

import { TutorTable } from "./schema";

// Status badge variants
const getStatusVariant = (status: TutorStatus) => {
  switch (status) {
    case "approved":
      return "default";
    case "pending":
      return "secondary";
    case "rejected":
      return "destructive";
    case "suspended":
      return "outline";
    default:
      return "outline";
  }
};

const getStatusIcon = (status: TutorStatus) => {
  switch (status) {
    case "approved":
      return <CheckCircle className="h-3 w-3" />;
    case "pending":
      return <Clock className="h-3 w-3" />;
    case "rejected":
      return <XCircle className="h-3 w-3" />;
    case "suspended":
      return <AlertCircle className="h-3 w-3" />;
    default:
      return null;
  }
};

// Rating stars component
const RatingStars = ({ rating, count }: { rating: number; count: number }) => {
  return (
    <div className="flex items-center gap-1">
      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      <span className="text-sm font-medium">{rating.toFixed(1)}</span>
      <span className="text-sm text-muted-foreground">({count})</span>
    </div>
  );
};

export const createTutorsColumns = (router: ReturnType<typeof useRouter>): ColumnDef<TutorTable>[] => [
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
      <DataTableColumnHeader column={column} title="Tutor" />
    ),
    cell: ({ row }) => {
      const tutor = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={tutor.phone} alt={tutor.name} />
            <AvatarFallback>
              {tutor.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-medium">{tutor.name}</span>
              {tutor.isFeatured && <Crown className="h-4 w-4 text-yellow-500" />}
            </div>
            <span className="text-sm text-muted-foreground">{tutor.email}</span>
            <span className="text-xs text-muted-foreground">{tutor.phone}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <div className="flex items-center gap-2">
          <Badge variant={getStatusVariant(status)} className="flex items-center gap-1">
            {getStatusIcon(status)}
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
          {row.original.isVerified && (
            <Badge variant="outline" className="text-green-600 border-green-600">
              Verified
            </Badge>
          )}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "subjects",
    header: "Subjects",
    cell: ({ row }) => {
      const subjects = row.original.subjects;
      return (
        <div className="flex flex-wrap gap-1 max-w-xs">
          {subjects.slice(0, 2).map((subject, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {subject}
            </Badge>
          ))}
          {subjects.length > 2 && (
            <Badge variant="secondary" className="text-xs">
              +{subjects.length - 2} more
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "location",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Location" />
    ),
    cell: ({ row }) => {
      const location = row.original.location;
      return (
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span>{location.city}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "pricing",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price/Hour" />
    ),
    cell: ({ row }) => {
      const pricing = row.original.pricing;
      return (
        <div className="text-sm">
          <div className="font-medium">₹{pricing.oneToOne.hourlyRate}</div>
          <div className="text-muted-foreground text-xs">1-on-1</div>
        </div>
      );
    },
  },
  {
    accessorKey: "rating",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Rating" />
    ),
    cell: ({ row }) => (
      <RatingStars
        rating={row.original.averageRating}
        count={row.original.totalReviews}
      />
    ),
    sortingFn: (rowA, rowB) => {
      return rowA.original.averageRating - rowB.original.averageRating;
    },
  },
  {
    accessorKey: "analytics",
    header: "Analytics",
    cell: ({ row }) => {
      const { profileViews, connects } = row.original;
      return (
        <div className="text-sm space-y-1">
          <div className="flex items-center gap-2">
            <Eye className="h-3 w-3 text-muted-foreground" />
            <span>{profileViews.toLocaleString()} views</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <span>{connects} connects</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "submittedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Submitted" />
    ),
    cell: ({ row }) => {
      const date = row.original.submittedAt || row.original.createdAt;
      return (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{format(new Date(date), "MMM dd, yyyy")}</span>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const tutor = row.original;
      const [showDeleteDialog, setShowDeleteDialog] = useState(false);
      const [isActionLoading, setIsActionLoading] = useState<string | null>(null);

      const handleStatusChange = async (newStatus: string, reason?: string) => {
        setIsActionLoading(newStatus);
        try {
          const endpoint = newStatus === "approve" ? "/api/admin/tutors/approve" :
                         newStatus === "reject" ? "/api/admin/tutors/reject" :
                         "/api/admin/tutors/suspend";

          const body = newStatus === "approve"
            ? { tutorIds: [tutor.id] }
            : { tutorIds: [tutor.id], reason };

          const response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });

          const result = await response.json();

          if (response.ok) {
            toast.success(`Tutor ${newStatus}d successfully`);
            window.dispatchEvent(new CustomEvent("refreshTutorsTable"));
          } else {
            toast.error(result.error || `Failed to ${newStatus} tutor`);
          }
        } catch (error) {
          toast.error(`An error occurred while ${newStatus}ing the tutor`);
        } finally {
          setIsActionLoading(null);
        }
      };

      const handleVerify = async () => {
        setIsActionLoading("verify");
        try {
          const response = await fetch(`/api/admin/tutors/${tutor.id}/verify`, {
            method: "POST",
          });

          const result = await response.json();

          if (response.ok) {
            toast.success("Tutor verified successfully");
            window.dispatchEvent(new CustomEvent("refreshTutorsTable"));
          } else {
            toast.error(result.error || "Failed to verify tutor");
          }
        } catch (error) {
          toast.error("An error occurred while verifying the tutor");
        } finally {
          setIsActionLoading(null);
        }
      };

      const handleFeature = async () => {
        setIsActionLoading("feature");
        try {
          const response = await fetch(`/api/admin/tutors/${tutor.id}/feature`, {
            method: "POST",
          });

          const result = await response.json();

          if (response.ok) {
            toast.success(`Tutor ${tutor.isFeatured ? "unfeatured" : "featured"} successfully`);
            window.dispatchEvent(new CustomEvent("refreshTutorsTable"));
          } else {
            toast.error(result.error || "Failed to update tutor");
          }
        } catch (error) {
          toast.error("An error occurred while updating the tutor");
        } finally {
          setIsActionLoading(null);
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
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(tutor.id)}>
                <Eye className="mr-2 h-4 w-4" />
                Copy Tutor ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push(`/dashboard/tutors/edit/${tutor.id}`)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Details
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Change Status
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  {tutor.status !== "approved" && (
                    <DropdownMenuItem
                      onClick={() => handleStatusChange("approve")}
                      disabled={isActionLoading === "approve"}
                    >
                      <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                      Approve
                    </DropdownMenuItem>
                  )}
                  {tutor.status !== "rejected" && (
                    <DropdownMenuItem
                      onClick={() => handleStatusChange("reject")}
                      disabled={isActionLoading === "reject"}
                    >
                      <XCircle className="mr-2 h-4 w-4 text-red-600" />
                      Reject
                    </DropdownMenuItem>
                  )}
                  {tutor.status !== "suspended" && (
                    <DropdownMenuItem
                      onClick={() => handleStatusChange("suspend")}
                      disabled={isActionLoading === "suspend"}
                    >
                      <AlertCircle className="mr-2 h-4 w-4 text-orange-600" />
                      Suspend
                    </DropdownMenuItem>
                  )}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleVerify}
                disabled={isActionLoading === "verify" || tutor.isVerified}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                {tutor.isVerified ? "Verified" : "Verify Tutor"}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleFeature}
                disabled={isActionLoading === "feature"}
              >
                <Crown className="mr-2 h-4 w-4" />
                {tutor.isFeatured ? "Remove Featured" : "Make Featured"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];