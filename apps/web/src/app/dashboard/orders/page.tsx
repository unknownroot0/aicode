"use client";

import { useEffect, useState } from "react";
import { adminOrderAPI } from "@/lib/adminServices";
import useSWR from "swr";
import { toast } from "sonner";
import { Order } from "@/types";
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
import { RotateCw, ShoppingCart } from "lucide-react";
import { SearchBar } from "@/components/admin/SearchBar";
import { EmptyState } from "@/components/admin/EmptyState";
import { Pagination } from "@/components/admin/Pagination";

const ORDER_STATUSES = [
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
];

export default function OrdersPage() {
  const { data: orders = [], error, isLoading: loading, mutate } = useSWR('adminOrders', adminOrderAPI.getAll);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingId(orderId);
      await adminOrderAPI.updateStatus(orderId, newStatus);
      toast.success("Order status updated successfully");
      mutate();
    } catch (err) {
      toast.error("Failed to update order status");
    } finally {
      setUpdatingId(null);
    }
  };

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-none";
      case "COMPLETED":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-none";
      case "PROCESSING":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-none";
      case "SHIPPED":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400 border-none";
      case "PENDING":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-none";
      case "CANCELLED":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-none";
      case "FAILED":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-none";
      case "REFUNDED":
        return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400 border-none";
      default:
        return "bg-secondary";
    }
  };

  const filtered = orders.filter((o: any) => {
    const matchesSearch =
      o.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  const paginatedOrders = filtered.slice(
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
          <h2 className="text-accent font-bold md:text-2xl text-xl font-sans">Orders</h2>
          <p className="text-accent-foreground md:text-base text-sm">
            Manage customer orders
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
            placeholder="Search by order #, email, name..."
            value={searchTerm}
            onChange={handleSearch}
          />

          <div className="sm:w-40 w-full">
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value);
                setPage(1);
              }}
            >
              <SelectTrigger className="border-default bg-white dark:bg-[#141414] w-full">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                {ORDER_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <EmptyState
              icon={ShoppingCart}
              title={
                searchTerm || statusFilter !== "ALL"
                  ? "No orders match your filters"
                  : "No orders yet"
              }
              description={
                searchTerm || statusFilter !== "ALL"
                  ? "There are no orders matching your current search or status filter."
                  : "You haven't received any orders yet."
              }
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-default bg-muted/50">
                  <TableHead>Order #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedOrders.map((order: any) => (
                  <TableRow key={order.id} className="border-default">
                    <TableCell className="font-semibold text-sm">
                      {order.orderNumber}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">
                          {order.user?.firstName
                            ? `${order.user.firstName} ${order.user.lastName || ""}`
                            : "—"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {order.user?.email || "No email"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {order.items?.length || 0} items
                    </TableCell>
                    <TableCell className="font-medium">
                      ${Number(order.totalAmount).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge className={getBadgeVariant(order.status)}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getBadgeVariant(order.paymentStatus)}>
                        {order.paymentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Select
                        value={order.status}
                        onValueChange={(value) =>
                          handleStatusChange(order.id, value)
                        }
                        disabled={updatingId === order.id}
                      >
                        <SelectTrigger className="h-8 w-32.5 ml-auto border-default">
                          <SelectValue placeholder="Update status" />
                        </SelectTrigger>
                        <SelectContent align="end">
                          {ORDER_STATUSES.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
