"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminProductAPI } from "@/lib/adminServices";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Plus, Trash, Edit, PackageSearch, RotateCw } from "lucide-react";
import { SearchBar } from "@/components/admin/SearchBar";
import { EmptyState } from "@/components/admin/EmptyState";
import { Pagination } from "@/components/admin/Pagination";
import { getProductImageUrl } from "@/lib/utils";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import { toast } from "sonner";
import useSWR from "swr";

export default function ProductsPage() {
  const {
    data: products = [],
    error,
    isLoading: loading,
    mutate,
  } = useSWR("adminProducts", adminProductAPI.getAll);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(true);
      await adminProductAPI.delete(id);
      toast.success("Product deleted successfully");
      mutate();
      setDeleteConfirm(null);
    } catch (err) {
      toast.error("Failed to delete product");
    } finally {
      setIsDeleting(false);
    }
  };

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.description &&
        p.description.toLowerCase().includes(searchTerm.toLowerCase()));

    let matchesStatus = true;
    if (statusFilter === "ACTIVE") matchesStatus = p.isActive === true;
    if (statusFilter === "INACTIVE") matchesStatus = p.isActive === false;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  const paginatedProducts = filtered.slice(
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
          <h2 className="text-accent font-bold md:text-2xl text-xl font-sans">
            Products
          </h2>
          <p className="text-accent-foreground md:text-base text-sm">
            Manage your product catalog
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => mutate()}
            className="bg-white dark:bg-[#27292D] size-9.5 hover:bg-card active:scale-95 transition-all cursor-pointer shrink-0"
            title="Refresh"
          >
            <RotateCw className="h-4 w-4" />
          </Button>

          <Button
            asChild
            className="bg-primary hover:bg-primary/90 text-white active:scale-95 transition-all"
          >
            <Link href="/dashboard/products/new">
              <Plus className="h-4 w-4" />
              Add Product
            </Link>
          </Button>
        </div>
      </div>

      <Card className="border card-border shadow-lg shadow-[#2E2D740D] rounded-[10px] overflow-hidden bg-card mt-8">
        <div className="bg-card-header sm:px-6 px-4 py-3 flex sm:items-center justify-between gap-4 sm:flex-nowrap flex-wrap border-b card-border">
          <SearchBar
            placeholder="Search products..."
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
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <EmptyState
              icon={PackageSearch}
              title={
                searchTerm || statusFilter !== "ALL"
                  ? "No products found"
                  : "No products yet"
              }
              description={
                searchTerm || statusFilter !== "ALL"
                  ? "There are no products matching your filters"
                  : "Your product catalog is currently empty."
              }
              action={
                !searchTerm ? (
                  <Button asChild variant="outline">
                    <Link href="/dashboard/products/new">
                      Add Your First Product
                    </Link>
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-default bg-muted/50">
                  <TableHead className="w-75">Product</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedProducts.map((product) => (
                  <TableRow key={product.id} className="border-default">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {(product.thumbnail || (product.images && product.images.length > 0)) ? (
                          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md border border-default">
                            <img
                              src={getProductImageUrl(product.thumbnail || product.images?.[0]) || "/images/product-img.png"}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-md border border-default bg-muted text-muted-foreground">
                            <PackageSearch className="h-5 w-5" />
                          </div>
                        )}
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">
                            {product.name}
                          </span>
                          {product.description && (
                            <span className="text-xs text-muted-foreground line-clamp-1 max-w-50">
                              {product.description}
                            </span>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      ৳{Number(product.price).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <span
                        className={
                          product.stock <= 0
                            ? "text-destructive font-medium"
                            : product.stock <= 5
                              ? "text-amber-500 font-medium"
                              : ""
                        }
                      >
                        {product.stock}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={product.isActive ? "default" : "secondary"}
                        className={
                          product.isActive
                            ? "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400"
                            : ""
                        }
                      >
                        {product.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          asChild
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer active:scale-95 transition-all"
                        >
                          <Link href={`/dashboard/products/${product.id}/edit`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>

                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer active:scale-95 transition-all"
                          onClick={() => setDeleteConfirm(product.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
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

      <ConfirmModal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)}
        title="Delete Product"
        description="Are you sure you want to delete this product? This action cannot be undone."
        loading={isDeleting}
      />
    </div>
  );
}
