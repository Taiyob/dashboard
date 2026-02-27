import { useGetOrdersQuery, useUpdateOrderStatusMutation } from '@/features/order/orderApi';
import { createColumns } from './OrderColumns';
import { DataTable } from '@/pages/DataTable';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function Orders() {
    const { data: response, isLoading } = useGetOrdersQuery({});
    const [updateStatus] = useUpdateOrderStatusMutation();
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

    const columns = createColumns(updateStatus) as any;
    const allOrders = response?.data || [];

    // Client-side pagination
    const orders = allOrders.slice(
        pagination.pageIndex * pagination.pageSize,
        (pagination.pageIndex + 1) * pagination.pageSize
    );
    const totalPages = Math.ceil(allOrders.length / pagination.pageSize) || 1;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="p-4 space-y-4">
            <div>
                <h1 className="text-2xl font-bold">Orders Management</h1>
                <p className="text-muted-foreground text-sm">
                    View and manage customer orders and fulfillment status.
                </p>
            </div>

            <div className="bg-white rounded-md shadow p-2">
                <DataTable
                    columns={columns}
                    data={orders}
                    totalPages={totalPages}
                    totalRows={allOrders.length}
                    pagination={pagination}
                    onPaginationChange={setPagination}
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
}
