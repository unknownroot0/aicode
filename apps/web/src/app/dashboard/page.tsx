"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import useSWR from "swr";
import { adminUserAPI, adminOrderAPI } from "@/lib/adminServices";
import { toast } from "sonner";
import { Order } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatusBadge } from "@/components/dashboard/shared/StatusBadge";
import {
  ShoppingCart,
  ArrowRight,
  TrendingUp,
  Globe,
  Users,
  Wallet,
  RotateCw,
} from "lucide-react";
import { StatsCard } from "@/components/admin/StatsCard";
import { LoadingSpinner } from "@/components/admin/LoadingSpinner";

type Stats = {
  totalProducts: number;
  totalOrders: number;
  totalCustomers: number;
  totalRevenue: number;
};

export default function DashboardPage() {
  const fetcher = async () => {
    const [statsData, ordersData] = await Promise.all([
      adminUserAPI.getStats(),
      adminOrderAPI.getAll(),
    ]);
    return { stats: statsData as Stats, recentOrders: ordersData.slice(0, 10) as Order[] };
  };

  const { data, error, isLoading: loading, mutate } = useSWR('dashboardMain', fetcher);
  const stats = data?.stats || null;
  const recentOrders = data?.recentOrders || [];

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-accent font-bold md:text-2xl text-xl font-sans">
            Dashboard
          </h2>
          <p className="text-accent-foreground md:text-base text-sm">
            Overview of your business performance
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

      {/* Stats Cards */}
      {!stats ? (
        <div className="rounded-lg border bg-muted/50 p-6 text-center">
          <p className="text-muted-foreground">No sales data available</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Products"
            value={stats.totalProducts}
            icon={Globe}
            to="/dashboard/products"
          />
          <StatsCard
            title="Total Orders"
            value={stats.totalOrders}
            icon={TrendingUp}
            to="/dashboard/orders"
          />
          <StatsCard
            title="Total Customers"
            value={stats.totalCustomers}
            icon={Users}
            to="/dashboard/customers"
          />
          <StatsCard
            title="Total Revenue"
            value={stats.totalRevenue.toFixed(2)}
            icon={Wallet}
          />
        </div>
      )}

      {/* Recent Orders Table */}
      <Card className="border card-border shadow-lg shadow-[#2E2D740D] rounded-[10px] overflow-hidden bg-card mt-8">
        <CardHeader className="flex flex-row flex-wrap gap-2 items-center justify-between bg-[#FAFAFB] dark:bg-[#191B1F] sm:px-6 px-4 py-4 border-b border-default">
          <div className="space-y-1">
            <CardTitle className="text-xl font-bold">Recent Orders</CardTitle>
            <CardDescription className="text-sm">
              Latest 10 orders placed
            </CardDescription>
          </div>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="flex h-9 shadow-sm hover:bg-slate-50 dark:hover:bg-black"
          >
            <Link href="/dashboard/orders">
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {recentOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
              <ShoppingCart className="h-10 w-10 mb-4 opacity-50 text-slate-400" />
              <p>No orders yet</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order: any) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-semibold">
                      {order.orderNumber}
                    </TableCell>
                    <TableCell>
                      {order.user?.firstName
                        ? `${order.user.firstName} ${order.user.lastName || ""}`
                        : order.user?.email || order.userId}
                    </TableCell>
                    <TableCell className="font-medium">
                      ${Number(order.totalAmount).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={order.status} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
