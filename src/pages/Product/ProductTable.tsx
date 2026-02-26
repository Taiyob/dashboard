import React from "react";
import { DataTable } from "../DataTable";
import { useProductsQuery } from "@/features/Product/product";
import { columns } from "./Columns";

export default function ProductTable({
  searchQuery,
}: {
  searchQuery: string;
}) {
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const queryParams: any = {
    page: Math.max(1, pagination.pageIndex + 1),
    limit: pagination.pageSize,
  };

  if (searchQuery) queryParams.search = searchQuery;

  const { data, isLoading, error } = useProductsQuery(queryParams);

  if (error) {
    console.error("[Product Table Error]:", JSON.stringify(error, null, 2));
  }
  console.log("[Product Table Request Params]:", queryParams);

  const totalRows = (data as any)?.meta?.pagination?.total ?? 0;
  const totalPages = (data as any)?.meta?.pagination?.totalPages ?? 0;

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
