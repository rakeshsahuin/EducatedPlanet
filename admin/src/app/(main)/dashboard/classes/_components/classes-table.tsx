"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Download, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { ClassCategory } from "@educatedplanet/models";

import { classesColumns } from "./columns";
import { ClassModal } from "./class-modal";
import type { ClassTable, ClassSearch } from "./schema";

interface ClassesResponse {
  success: boolean;
  data: ClassTable[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function ClassesTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [hasSubClassesFilter, setHasSubClassesFilter] = useState<string>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ClassTable[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [sortBy, setSortBy] = useState("sortOrder");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [refreshing, setRefreshing] = useState(false);

  // Fetch classes from API
  const fetchClasses = async (params?: Partial<ClassSearch>) => {
    setLoading(true);
    try {
      const searchParams = new URLSearchParams({
        page: (params?.page || pagination.page).toString(),
        limit: (params?.limit || pagination.limit).toString(),
        sortBy: params?.sortBy || sortBy,
        sortOrder: params?.sortOrder || sortOrder,
        ...(searchTerm && { search: searchTerm }),
        ...(categoryFilter !== "all" && { category: categoryFilter }),
        ...(statusFilter !== "all" && { status: statusFilter }),
        ...(hasSubClassesFilter !== "all" && { hasSubClasses: hasSubClassesFilter }),
      });

      const response = await fetch(`/api/classes?${searchParams}`);
      const result: ClassesResponse = await response.json();

      if (response.ok) {
        setData(result.data.map(item => ({
          ...item,
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt),
        })));
        setPagination(result.pagination);
      } else {
        toast.error(result.error || "Failed to fetch classes");
      }
    } catch (error) {
      toast.error("An error occurred while fetching classes");
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch and refresh
  useEffect(() => {
    fetchClasses();
  }, [searchTerm, categoryFilter, statusFilter, hasSubClassesFilter, sortBy, sortOrder]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchClasses();
    setRefreshing(false);
    toast.success("Classes refreshed successfully");
  };

  const handleExport = async () => {
    try {
      // Get all classes without pagination for export
      const searchParams = new URLSearchParams({
        limit: "1000", // Large number to get all records
        sortBy: "name",
        sortOrder: "asc",
      });

      const response = await fetch(`/api/classes?${searchParams}`);
      const result = await response.json();

      if (response.ok) {
        // Create CSV content
        const headers = ["Name", "Code", "Category", "Status", "Sub-classes", "Created Date"];
        const csvContent = [
          headers.join(","),
          ...result.data.map((item: ClassTable) => [
            `"${item.name}"`,
            `"${item.code}"`,
            `"${item.category}"`,
            `"${item.isActive ? "Active" : "Inactive"}"`,
            `"${item.subClasses.length > 0 ? item.subClasses.join("; ") : ""}"`,
            `"${new Date(item.createdAt).toLocaleDateString()}"`,
          ].join(","))
        ].join("\n");

        // Create and download CSV file
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `classes_export_${new Date().toISOString().split("T")[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        toast.success("Classes exported successfully");
      } else {
        toast.error(result.error || "Failed to export classes");
      }
    } catch (error) {
      toast.error("An error occurred while exporting classes");
    }
  };

  const handleClassSubmit = async (data: any) => {
    try {
      const response = await fetch("/api/classes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Class created successfully");
        setShowCreateModal(false);
        fetchClasses();
      } else {
        toast.error(result.error || "Failed to create class");
      }
    } catch (error) {
      toast.error("An error occurred while creating the class");
    }
  };

  const table = useDataTableInstance({
    data,
    columns: classesColumns,
    getRowId: (row) => row.id.toString(),
    defaultPageSize: pagination.limit,
    manualPagination: true,
    pageCount: pagination.totalPages,
    pagination: {
      pageIndex: pagination.page - 1,
      pageSize: pagination.limit,
    },
    onPaginationChange: (updater) => {
      const newPagination = typeof updater === "function"
        ? updater({ pageIndex: pagination.page - 1, pageSize: pagination.limit })
        : updater;

      setPagination(prev => ({
        ...prev,
        page: newPagination.pageIndex + 1,
        limit: newPagination.pageSize,
      }));
      fetchClasses({
        page: newPagination.pageIndex + 1,
        limit: newPagination.pageSize,
      });
    },
    defaultSorting: [{ id: sortBy, desc: sortOrder === "desc" }],
    manualSorting: true,
    onSortingChange: (updater) => {
      const newSorting = typeof updater === "function"
        ? updater([{ id: sortBy, desc: sortOrder === "desc" }])
        : updater;

      if (newSorting.length > 0) {
        setSortBy(newSorting[0].id);
        setSortOrder(newSorting[0].desc ? "desc" : "asc");
      }
    },
  });

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Classes Management</span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <ClassModal mode="create" onSubmit={handleClassSubmit}>
                <Button variant="default">Add New Class</Button>
              </ClassModal>
            </div>
          </CardTitle>
          <CardDescription>
            Manage and monitor all educational classes on the platform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search classes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {Object.values(ClassCategory).map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
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
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>

              <Select value={hasSubClassesFilter} onValueChange={setHasSubClassesFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Sub-classes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  <SelectItem value="true">Has Sub-classes</SelectItem>
                  <SelectItem value="false">No Sub-classes</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>

              <DataTableViewOptions table={table} />
            </div>
          </div>

          {/* Table */}
          <DataTable
            table={table}
            columns={classesColumns}
            data={data}
            loading={loading}
            noResultsMessage="No classes found. Try adjusting your search or filters."
          />

          {/* Pagination */}
          <DataTablePagination
            table={table}
            totalItems={pagination.total}
            currentPage={pagination.page}
            pageSize={pagination.limit}
          />
        </CardContent>
      </Card>

      {/* Create Modal */}
      {showCreateModal && (
        <ClassModal
          mode="create"
          onSubmit={handleClassSubmit}
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </div>
  );
}