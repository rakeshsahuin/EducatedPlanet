"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Download, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";
import { toast } from "sonner";

import { usersColumns } from "./columns";
import { UserModal } from "./user-modal";
import type { UserTable } from "./schema";

export function UsersTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [users, setUsers] = useState<UserTable[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });

  // Fetch users from API
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', pagination.currentPage.toString());
      params.append('limit', pagination.itemsPerPage.toString());

      if (searchTerm) {
        params.append('search', searchTerm);
      }

      if (roleFilter !== "all") {
        params.append('role', roleFilter);
      }

      if (statusFilter !== "all") {
        params.append('verificationStatus', statusFilter === "verified" ? "true" : "false");
      }

      const response = await fetch(`/api/users?${params}`);
      const result = await response.json();

      if (result.success) {
        // Transform data to match UserTable interface
        const transformedData = result.data.map((user: any) => ({
          ...user,
          createdAt: new Date(user.createdAt),
          updatedAt: new Date(user.updatedAt),
        }));
        setUsers(transformedData);
        if (result.pagination) {
          setPagination(prev => ({
            ...prev,
            currentPage: result.pagination.page || 1,
            totalPages: result.pagination.totalPages || 1,
            totalItems: result.pagination.total || 0,
            itemsPerPage: result.pagination.limit || 10,
          }));
        }
      } else {
        toast.error(result.error || "Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("An error occurred while fetching users");
    } finally {
      setLoading(false);
    }
  };

  // Fetch users on component mount and when filters or page changes
  useEffect(() => {
    fetchUsers();
  }, [searchTerm, roleFilter, statusFilter, pagination.currentPage]);

  // Listen for refresh events
  useEffect(() => {
    const handleRefresh = () => {
      fetchUsers();
    };
    window.addEventListener('refreshUsersTable', handleRefresh);
    return () => {
      window.removeEventListener('refreshUsersTable', handleRefresh);
    };
  }, [searchTerm, roleFilter, statusFilter, pagination.currentPage]);

  const table = useDataTableInstance({
    data: users,
    columns: usersColumns,
    getRowId: (row) => row.id.toString(),
    defaultPageSize: 10,
    defaultSorting: [{ id: "createdAt", desc: true }],
    defaultPageIndex: pagination.currentPage - 1,
    pageCount: pagination.totalPages,
    onPaginationChange: (updater) => {
      if (typeof updater === 'function') {
        const newPagination = updater({ pageIndex: pagination.currentPage - 1, pageSize: pagination.itemsPerPage });
        setPagination(prev => ({
          ...prev,
          currentPage: newPagination.pageIndex + 1,
        }));
      } else {
        setPagination(prev => ({
          ...prev,
          currentPage: updater.pageIndex + 1,
        }));
      }
    },
  });

  const handleExport = () => {
    toast.success("Users data exported successfully");
  };

  const handleUserSubmit = async (data: any) => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('User created successfully');
        setShowCreateModal(false);
        // Trigger table refresh
        window.dispatchEvent(new CustomEvent('refreshUsersTable'));
      } else {
        toast.error(result.error || 'Failed to create user');
      }
    } catch (error) {
      toast.error('An error occurred while creating the user');
    }
  };

  const uniqueRoles = ["user", "tutor", "sub-admin", "admin"];

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Users Management</span>
            <div className="flex items-center gap-2">
              <UserModal
                mode="create"
                onSubmit={handleUserSubmit}
                onClose={() => setShowCreateModal(false)}
              >
                <Button variant="default">Add New User</Button>
              </UserModal>
            </div>
          </CardTitle>
          <CardDescription>
            Manage and monitor all users on the platform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  {uniqueRoles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role === 'sub-admin' ? 'Sub-Admin' : role.charAt(0).toUpperCase() + role.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="unverified">Unverified</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          {/* Active Filters Display */}
          {(searchTerm || roleFilter !== "all" || statusFilter !== "all") && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {searchTerm && (
                <Badge variant="secondary" className="gap-1">
                  Search: {searchTerm}
                  <button
                    onClick={() => setSearchTerm("")}
                    className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {roleFilter !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  Role: {roleFilter}
                  <button
                    onClick={() => setRoleFilter("all")}
                    className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {statusFilter !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  Status: {statusFilter}
                  <button
                    onClick={() => setStatusFilter("all")}
                    className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                  >
                    ×
                  </button>
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm("");
                  setRoleFilter("all");
                  setStatusFilter("all");
                }}
              >
                Clear all
              </Button>
            </div>
          )}

          {/* Results Count */}
          <div className="text-sm text-muted-foreground">
            {loading ? (
              "Loading users..."
            ) : (
              `Showing ${users.length} of ${pagination.totalItems} users`
            )}
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle>All Users</CardTitle>
            <CardDescription>
              A list of all users on the platform including their information and status.
            </CardDescription>
          </div>
          <DataTableViewOptions table={table} />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <div className="overflow-hidden rounded-md border">
              <DataTable table={table} columns={usersColumns} />
            </div>

            {/* Loading Overlay */}
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Loading users...</span>
                </div>
              </div>
            )}
          </div>
          <DataTablePagination table={table} />
        </CardContent>
      </Card>
    </div>
  );
}