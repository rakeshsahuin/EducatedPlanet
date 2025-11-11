"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Download, RefreshCw, GraduationCap } from "lucide-react";
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

import { subjectsColumns } from "./columns";
import { SubjectModal } from "./subject-modal";
import type { SubjectTable, SubjectSearch } from "./schema";

interface SubjectsResponse {
  success: boolean;
  data: SubjectTable[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  error?: string;
}

export function SubjectsTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAcademicFilter, setIsAcademicFilter] = useState<string>("all");
  const [isActiveFilter, setIsActiveFilter] = useState<string>("all");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [popularFilter, setPopularFilter] = useState<string>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<SubjectTable[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [sortBy, setSortBy] = useState("sortOrder");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [refreshing, setRefreshing] = useState(false);

  // Fetch subjects from API
  const fetchSubjects = async (params?: Partial<SubjectSearch>) => {
    setLoading(true);
    try {
      const paramsObj: Record<string, string> = {
        page: (params?.page || pagination.page).toString(),
        limit: (params?.limit || pagination.limit).toString(),
        sortBy: params?.sortBy || sortBy,
        sortOrder: params?.sortOrder || sortOrder,
      };

      if (searchTerm) paramsObj.search = searchTerm;
      if (isAcademicFilter !== "all") paramsObj.isAcademic = (isAcademicFilter === "true").toString();
      if (isActiveFilter !== "all") paramsObj.isActive = (isActiveFilter === "true").toString();
      if (difficultyFilter !== "all") paramsObj.difficulty = difficultyFilter;
      if (popularFilter !== "all") paramsObj.popular = (popularFilter === "true").toString();

      const searchParams = new URLSearchParams(paramsObj);

      const response = await fetch(`/api/subjects?${searchParams}`);
      const result: SubjectsResponse = await response.json();

      if (response.ok) {
        setData(result.data.map(item => ({
          ...item,
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt),
        })));
        setPagination(result.pagination);
      } else {
        toast.error(result.error || "Failed to fetch subjects");
      }
    } catch (error) {
      toast.error("An error occurred while fetching subjects");
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch and refresh
  useEffect(() => {
    fetchSubjects();
  }, [searchTerm, isAcademicFilter, isActiveFilter, difficultyFilter, popularFilter, sortBy, sortOrder]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchSubjects();
    setRefreshing(false);
    toast.success("Subjects refreshed successfully");
  };

  const handleExport = async () => {
    try {
      // Get all subjects without pagination for export
      const searchParams = new URLSearchParams({
        limit: "1000", // Large number to get all records
        sortBy: "name",
        sortOrder: "asc",
      });

      const response = await fetch(`/api/subjects?${searchParams}`);
      const result = await response.json();

      if (response.ok) {
        // Create CSV content
        const headers = ["Code", "Name", "Type", "Status", "Keywords", "Difficulty", "Classes", "Created Date"];
        const csvContent = [
          headers.join(","),
          ...result.data.map((item: SubjectTable) => [
            `"${item.code}"`,
            `"${item.name}"`,
            `"${item.isAcademic ? "Academic" : "Non-Academic"}"`,
            `"${item.isActive ? "Active" : "Inactive"}"`,
            `"${item.keywords.join("; ")}`,
            `"${item.metadata?.difficulty || "Not set"}"`,
            `"${item.classIds.length}"`,
            `"${new Date(item.createdAt).toLocaleDateString()}"`,
          ].join(","))
        ].join("\n");

        // Create and download CSV file
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `subjects_export_${new Date().toISOString().split("T")[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        toast.success("Subjects exported successfully");
      } else {
        toast.error(result.error || "Failed to export subjects");
      }
    } catch (error) {
      toast.error("An error occurred while exporting subjects");
    }
  };

  const handleSubjectSubmit = async (data: any) => {
    try {
      const response = await fetch("/api/subjects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Subject created successfully");
        setShowCreateModal(false);
        fetchSubjects();
      } else {
        toast.error(result.error || "Failed to create subject");
      }
    } catch (error) {
      toast.error("An error occurred while creating the subject");
    }
  };

  const table = useDataTableInstance({
    data,
    columns: subjectsColumns,
    getRowId: (row) => row.id.toString(),
    defaultPageSize: 10,
    defaultSorting: [{ id: sortBy, desc: sortOrder === "desc" }],
  });

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Subjects Management
            </span>
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
              <SubjectModal mode="create" onSubmit={handleSubjectSubmit}>
                <Button variant="default">Add New Subject</Button>
              </SubjectModal>
            </div>
          </CardTitle>
          <CardDescription>
            Manage and monitor all educational subjects on the platform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search subjects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Select value={isAcademicFilter} onValueChange={setIsAcademicFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="true">Academic</SelectItem>
                  <SelectItem value="false">Non-Academic</SelectItem>
                </SelectContent>
              </Select>

              <Select value={isActiveFilter} onValueChange={setIsActiveFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>

              <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>

              <Select value={popularFilter} onValueChange={setPopularFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Popular" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  <SelectItem value="true">Popular</SelectItem>
                  <SelectItem value="false">Not Popular</SelectItem>
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
            columns={subjectsColumns}
          />

          {/* Pagination */}
          <DataTablePagination
            table={table}
          />
        </CardContent>
      </Card>
    </div>
  );
}