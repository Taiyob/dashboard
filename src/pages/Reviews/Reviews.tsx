import { useGetReviewsQuery } from "@/features/review/reviewApi";
import { DataTable } from "../DataTable";
import { columns } from "./Columns";
import { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Reviews = () => {
    const [status, setStatus] = useState<string>("all");
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });

    const { data: response, isLoading } = useGetReviewsQuery({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        isApproved: status === "all" ? undefined : status === "approved"
    });

    const reviews = response?.data || [];
    const totalRows = response?.meta?.pagination?.total ?? 0;
    const totalPages = response?.meta?.pagination?.totalPages ?? 1;

    return (
        <div className="flex-1 space-y-4 p-4 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Review Management</h2>
            </div>

            <Tabs defaultValue="all" className="space-y-4" onValueChange={(val) => {
                setStatus(val);
                setPagination({ ...pagination, pageIndex: 0 });
            }}>
                <TabsList>
                    <TabsTrigger value="all">All Reviews</TabsTrigger>
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="approved">Approved</TabsTrigger>
                </TabsList>

                <Card>
                    <CardHeader>
                        <CardTitle>Customer Feedback</CardTitle>
                        <CardDescription>
                            Manage and approve product reviews to show them on the storefront.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <DataTable
                            columns={columns}
                            data={reviews}
                            isLoading={isLoading}
                            totalRows={totalRows}
                            totalPages={totalPages}
                            pagination={pagination}
                            onPaginationChange={setPagination}
                        />
                    </CardContent>
                </Card>
            </Tabs>
        </div>
    );
};

export default Reviews;
