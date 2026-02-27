/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { DataTable } from "../DataTable";
import { useProductsQuery } from "@/features/Product/product";
import { columns } from "./Columns";

interface ProductTableProps {
  searchQuery: string;
  sortQuery: string;
  sortOrder: "asc" | "desc";
}

export default function ProductTable({
  searchQuery,
  sortQuery,
  sortOrder,
}: ProductTableProps) {
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const queryParams: Record<string, string | number> = {
    page: Math.max(1, pagination.pageIndex + 1),
    limit: pagination.pageSize,
  };

  // Search
  if (searchQuery.trim()) {
    queryParams.search = searchQuery.trim();
  }

  // Sorting
  if (sortQuery) {
    queryParams.sortBy = sortQuery;
  }

  // Backend expects 'order' instead of 'sortOrder'
  if (sortOrder) {
    queryParams.order = sortOrder;
  }

  // Optional: Default sorting যদি কোনো sort না দেওয়া থাকে
  // (অনেক সময় নতুন প্রোডাক্ট প্রথমে দেখাতে চাই)
  if (!sortQuery) {
    queryParams.sortBy = "createdAt";
    queryParams.order = "desc";
  }

  const { data, isLoading, error, isError } = useProductsQuery(queryParams);

  // Better error logging + visible error state (optional UI feedback)
  if (isError) {
    console.error("[Product Table Error]:", JSON.stringify(error, null, 2));
  }

  console.log("[Product Table Request Params]:", queryParams);

  const totalRows = (data as any)?.meta?.pagination?.total ?? 0;
  const totalPages = (data as any)?.meta?.pagination?.totalPages ?? 0;

  // Optional: Error UI দেখানো (ভালো UX-এর জন্য)
  if (isError) {
    return (
      <div className="p-6 text-center text-red-600 border border-red-200 rounded-md bg-red-50">
        <p className="font-medium">Products লোড করতে সমস্যা হয়েছে</p>
        <p className="text-sm mt-1">
          {(error as any)?.data?.error?.message || "অজানা ত্রুটি"}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-md border">
      <DataTable
        columns={columns}
        data={data?.data ?? []}
        totalRows={totalRows}
        totalPages={totalPages}
        pagination={pagination}
        onPaginationChange={setPagination}
        isLoading={isLoading}
      />
    </div>
  );
}
