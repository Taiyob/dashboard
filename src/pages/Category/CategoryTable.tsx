import React from "react";
import { DataTable } from "../DataTable";
import { columns } from "./Columns";
import { useCategoriesQuery } from "@/features/Category/category";

export default function CategoryTable({
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

  const { data, isLoading, error } = useCategoriesQuery(queryParams);

  if (error) {
    console.error("[Category Table Error]:", JSON.stringify(error, null, 2));
  }
  console.log("[Category Table Request Params]:", queryParams);
  console.log("[Category Table Response]:", data);
  if (data?.data && data.data.length > 0) {
    console.log("[Category Table First Item Detail]:", JSON.stringify(data.data[0], null, 2));
  }

  const totalRows = data?.meta?.pagination?.total ?? 0;
  const totalPages = data?.meta?.pagination?.totalPages ?? 1;

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
