"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Download, Loader2, CheckCircle, XCircle, AlertCircle, Users, Star, Crown } from "lucide-react";
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
import { TutorStatus } from "@educatedplanet/models";

import { tutorsColumns } from "./columns";
import { TutorTable, TutorSearchParams } from "./schema";

export function TutorsTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [cityFilter, setCityFilter] = useState<string>("all");
  const [verifiedFilter, setVerifiedFilter] = useState<string>("all");
  const [featuredFilter, setFeaturedFilter] = useState<string>("all");
  const [tutors, setTutors] = useState<TutorTable[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [bulkActionLoading, setBulkActionLoading] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });

  // Fetch tutors from API
  const fetchTutors = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', pagination.currentPage.toString());
      params.append('limit', pagination.itemsPerPage.toString());

      if (searchTerm) {
        params.append('query', searchTerm); // Backend expects 'query' not 'search'
      }

      if (statusFilter !== "all") {
        params.append('status', statusFilter);
      }

      if (cityFilter !== "all") {
        params.append('city', cityFilter);
      }

      if (verifiedFilter !== "all") {
        params.append('isVerified', verifiedFilter === "true" ? "true" : "false");
      }

      if (featuredFilter !== "all") {
        params.append('isFeatured', featuredFilter === "true" ? "true" : "false");
      }

      const response = await fetch(`/api/admin/tutors?${params}`);
      const result = await response.json();

      if (response.ok && result.success) {
        // Handle different response structures
        const tutorsData = Array.isArray(result.data?.tutors) ? result.data.tutors :
          Array.isArray(result.data) ? result.data : [];
        console.log('API Response:', { result, tutorsData }); // Debug log

        // Transform data to match TutorTable interface
        const transformedData = tutorsData.map((tutor: any) => ({
          id: tutor.id || tutor._id || "",
          userId: tutor.userId || "",
          name: tutor.name || "N/A",
          email: tutor.email || "",
          phone: tutor.phone || "",
          status: tutor.status || "pending",
          subjects: tutor.subjects || [],
          averageRating: tutor.rating?.average || 0,
          totalReviews: tutor.rating?.count || 0,
          isVerified: tutor.isVerified || false,
          isFeatured: tutor.isFeatured || false,
          location: {
            city: tutor.areas?.[0] || "N/A", // Use first area if city not available
            areas: tutor.areas || [],
          },
          pricing: {
            oneToOne: {
              hourlyRate: 0, // Default since not returned in list
            },
            group: {
              hourlyRate: undefined,
              maxStudents: undefined,
            },
          },
          profileViews: tutor.analytics?.profileViews || 0,
          connects: tutor.analytics?.connects || 0,
          createdAt: new Date(tutor.submittedAt || Date.now()),
          submittedAt: tutor.submittedAt ? new Date(tutor.submittedAt) : undefined,
          reviewedAt: undefined,
        }));
        setTutors(transformedData);

        // Handle pagination from response
        if (result.data?.pagination) {
          setPagination(prev => ({
            ...prev,
            currentPage: result.data.pagination.page || 1,
            totalPages: result.data.pagination.totalPages || 1,
            totalItems: result.data.pagination.total || 0,
            itemsPerPage: result.data.pagination.limit || 10,
          }));
        } else if (result.pagination) {
          setPagination(prev => ({
            ...prev,
            currentPage: result.pagination.page || 1,
            totalPages: result.pagination.totalPages || 1,
            totalItems: result.pagination.total || 0,
            itemsPerPage: result.pagination.limit || 10,
          }));
        }
      } else {
        toast.error(result.error || "Failed to fetch tutors");
      }
    } catch (error) {
      console.error("Error fetching tutors:", error);
      toast.error("An error occurred while fetching tutors");
    } finally {
      setLoading(false);
    }
  };

  // Fetch tutors on component mount and when filters or page changes
  useEffect(() => {
    fetchTutors();
  }, [searchTerm, statusFilter, cityFilter, verifiedFilter, featuredFilter, pagination.currentPage]);

  // Listen for refresh events
  useEffect(() => {
    const handleRefresh = () => {
      fetchTutors();
    };
    window.addEventListener('refreshTutorsTable', handleRefresh);
    return () => {
      window.removeEventListener('refreshTutorsTable', handleRefresh);
    };
  }, [searchTerm, statusFilter, cityFilter, verifiedFilter, featuredFilter, pagination.currentPage]);

  const table = useDataTableInstance({
    data: tutors,
    columns: tutorsColumns,
    getRowId: (row) => row.id,
    defaultPageSize: 10,
    defaultSorting: [{ id: "submittedAt", desc: true }],
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
    onRowSelectionChange: (updater) => {
      const newSelection = typeof updater === 'function' ? updater(table.getState().rowSelection) : updater;
      const selectedIds = Object.keys(newSelection).filter(key => newSelection[key]);
      setSelectedRows(selectedIds);
    },
  });

  // Bulk actions
  const handleBulkApprove = async () => {
    if (selectedRows.length === 0) {
      toast.error("Please select tutors to approve");
      return;
    }
    setBulkActionLoading("approve");
    try {
      const response = await fetch("/api/admin/tutors/bulk-approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tutorIds: selectedRows }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(`${result.data.success} tutors approved successfully`);
        setSelectedRows([]);
        table.resetRowSelection();
        fetchTutors();
      } else {
        toast.error(result.error || "Failed to approve tutors");
      }
    } catch (error) {
      toast.error("An error occurred while approving tutors");
    } finally {
      setBulkActionLoading(null);
    }
  };

  const handleBulkReject = async () => {
    if (selectedRows.length === 0) {
      toast.error("Please select tutors to reject");
      return;
    }
    const reason = prompt("Please provide rejection reason:");
    if (!reason) return;

    setBulkActionLoading("reject");
    try {
      const response = await fetch("/api/admin/tutors/bulk-reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tutorIds: selectedRows, reason }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(`${result.data.success} tutors rejected successfully`);
        setSelectedRows([]);
        table.resetRowSelection();
        fetchTutors();
      } else {
        toast.error(result.error || "Failed to reject tutors");
      }
    } catch (error) {
      toast.error("An error occurred while rejecting tutors");
    } finally {
      setBulkActionLoading(null);
    }
  };

  const handleBulkSuspend = async () => {
    if (selectedRows.length === 0) {
      toast.error("Please select tutors to suspend");
      return;
    }
    const reason = prompt("Please provide suspension reason:");
    if (!reason) return;

    setBulkActionLoading("suspend");
    try {
      const response = await fetch("/api/admin/tutors/bulk-suspend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tutorIds: selectedRows, reason }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(`${result.data.success} tutors suspended successfully`);
        setSelectedRows([]);
        table.resetRowSelection();
        fetchTutors();
      } else {
        toast.error(result.error || "Failed to suspend tutors");
      }
    } catch (error) {
      toast.error("An error occurred while suspending tutors");
    } finally {
      setBulkActionLoading(null);
    }
  };

  const handleExport = async () => {
    try {
      const params = new URLSearchParams();

      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter !== "all") params.append('status', statusFilter);
      if (cityFilter !== "all") params.append('city', cityFilter);
      if (verifiedFilter !== "all") params.append('verified', verifiedFilter === "true" ? "true" : "false");
      if (featuredFilter !== "all") params.append('featured', featuredFilter === "true" ? "true" : "false");
      params.append('format', 'csv');

      const response = await fetch(`/api/admin/tutors/export?${params}`);

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tutors_export_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success("Tutors data exported successfully");
      } else {
        const result = await response.json();
        toast.error(result.error || "Failed to export tutors");
      }
    } catch (error) {
      toast.error("An error occurred while exporting tutors");
    }
  };

  // Calculate stats
  const stats = {
    total: pagination.totalItems,
    pending: tutors.filter(t => t.status === "pending").length,
    approved: tutors.filter(t => t.status === "approved").length,
    featured: tutors.filter(t => t.isFeatured).length,
  };

  const cityOptions = ["all", "Bhubaneswar", "Cuttack", "Rourkela", "Puri", "Sambalpur"];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tutors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Registered tutors</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Waiting for review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
            <p className="text-xs text-muted-foreground">Active tutors</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Featured</CardTitle>
            <Crown className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.featured}</div>
            <p className="text-xs text-muted-foreground">Premium tutors</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Tutors Management</span>
            <div className="flex items-center gap-2">
              <Button variant="default" onClick={() => window.location.href = "/dashboard/tutors/add"}>
                Add New Tutor
              </Button>
            </div>
          </CardTitle>
          <CardDescription>
            Manage and monitor all tutors on the platform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search tutors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>

              <Select value={cityFilter} onValueChange={setCityFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="All Cities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cities</SelectItem>
                  {cityOptions.slice(1).map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={verifiedFilter} onValueChange={setVerifiedFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="All Tutors" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tutors</SelectItem>
                  <SelectItem value="true">Verified</SelectItem>
                  <SelectItem value="false">Not Verified</SelectItem>
                </SelectContent>
              </Select>

              <Select value={featuredFilter} onValueChange={setFeaturedFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Featured" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tutors</SelectItem>
                  <SelectItem value="true">Featured</SelectItem>
                  <SelectItem value="false">Not Featured</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedRows.length > 0 && (
            <div className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg">
              <span className="text-sm font-medium">
                {selectedRows.length} tutor{selectedRows.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={handleBulkApprove}
                  disabled={bulkActionLoading === "approve"}
                >
                  {bulkActionLoading === "approve" ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle className="mr-2 h-4 w-4" />
                  )}
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleBulkReject}
                  disabled={bulkActionLoading === "reject"}
                >
                  {bulkActionLoading === "reject" ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <XCircle className="mr-2 h-4 w-4" />
                  )}
                  Reject
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleBulkSuspend}
                  disabled={bulkActionLoading === "suspend"}
                >
                  {bulkActionLoading === "suspend" ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <AlertCircle className="mr-2 h-4 w-4" />
                  )}
                  Suspend
                </Button>
              </div>
            </div>
          )}

          {/* Active Filters Display */}
          {(searchTerm || statusFilter !== "all" || cityFilter !== "all" || verifiedFilter !== "all" || featuredFilter !== "all") && (
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
              {cityFilter !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  City: {cityFilter}
                  <button
                    onClick={() => setCityFilter("all")}
                    className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {verifiedFilter !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  Verified: {verifiedFilter === "true" ? "Yes" : "No"}
                  <button
                    onClick={() => setVerifiedFilter("all")}
                    className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {featuredFilter !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  Featured: {featuredFilter === "true" ? "Yes" : "No"}
                  <button
                    onClick={() => setFeaturedFilter("all")}
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
                  setStatusFilter("all");
                  setCityFilter("all");
                  setVerifiedFilter("all");
                  setFeaturedFilter("all");
                }}
              >
                Clear all
              </Button>
            </div>
          )}

          {/* Results Count */}
          <div className="text-sm text-muted-foreground">
            {loading ? (
              "Loading tutors..."
            ) : (
              `Showing ${tutors.length} of ${pagination.totalItems} tutors`
            )}
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle>All Tutors</CardTitle>
            <CardDescription>
              A list of all tutors on the platform including their information and status.
            </CardDescription>
          </div>
          <DataTableViewOptions table={table} />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <div className="overflow-hidden rounded-md border">
              <DataTable table={table} columns={tutorsColumns} />
            </div>

            {/* Loading Overlay */}
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Loading tutors...</span>
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