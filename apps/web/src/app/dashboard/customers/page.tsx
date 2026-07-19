"use client";

import { useEffect, useState } from "react";
import { adminUserAPI } from "@/lib/adminServices";
import useSWR from "swr";
import { toast } from "sonner";
import { User } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoadingSpinner } from "@/components/admin/LoadingSpinner";
import { RotateCw, Users, CheckCircle2, XCircle } from "lucide-react";
import { SearchBar } from "@/components/admin/SearchBar";
import { EmptyState } from "@/components/admin/EmptyState";
import { Pagination } from "@/components/admin/Pagination";

export default function CustomersPage() {
  const { data: users = [], error, isLoading: loading, mutate } = useSWR('adminCustomers', adminUserAPI.getAll);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  const filtered = users.filter((u) => {
    const matchesSearch =
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.firstName && u.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u.lastName && u.lastName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  
  const paginatedUsers = filtered.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-accent font-bold md:text-2xl text-xl font-sans">Customers</h2>
          <p className="text-accent-foreground md:text-base text-sm">
            View and manage all users
          </p>
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={() => mutate()}
          className="bg-white dark:bg-[#27292D] size-11 hover:bg-card active:scale-95 transition-all cursor-pointer shrink-0"
          title="Refresh"
        >
          <RotateCw className="h-4 w-4" />
        </Button>
      </div>

      <Card className="border card-border shadow-lg shadow-[#2E2D740D] rounded-[10px] overflow-hidden bg-card mt-8">
        <div className="bg-card-header sm:px-6 px-4 py-3 flex sm:items-center justify-between gap-4 md:flex-nowrap flex-wrap border-b card-border">
          <SearchBar
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={handleSearch}
          />

          <div className="sm:w-40 w-full">
            <Select
              value={roleFilter}
              onValueChange={(value) => {
                setRoleFilter(value);
                setPage(1);
              }}
            >
              <SelectTrigger className="border-default bg-white dark:bg-[#141414] w-full">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Roles</SelectItem>
                <SelectItem value="CUSTOMER">Customers</SelectItem>
                <SelectItem value="ADMIN">Admins</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <EmptyState
              icon={Users}
              title={searchTerm || roleFilter !== "ALL" ? "No users match your filters" : "No users yet"}
              description={searchTerm || roleFilter !== "ALL" ? "There are no users matching your current search or role filter." : "There are currently no users registered in the system."}
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-default bg-muted/50">
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Verified</TableHead>
                  <TableHead className="text-right">Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsers.map((user) => (
                  <TableRow key={user.id} className="border-default">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-medium border border-primary/20">
                          {user.firstName
                            ? user.firstName[0].toUpperCase()
                            : user.email[0].toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">
                            {user.firstName
                              ? `${user.firstName} ${user.lastName || ""}`
                              : "—"}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === "ADMIN" ? "default" : "secondary"} className={user.role === "ADMIN" ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={user.isActive ? "border-green-500 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10" : "border-red-500 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10"}>
                        {user.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        {user.emailVerified ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-muted-foreground/40" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {filtered.length > 0 && (
            <div className="sm:px-6 px-4 py-3 border-t border-default">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={(newPage) => setPage(newPage)}
                pageSize={pageSize}
                onPageSizeChange={(newPageSize) => {
                  setPageSize(newPageSize);
                  setPage(1);
                }}
                totalItems={filtered.length}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
