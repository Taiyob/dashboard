import type { ColumnDef } from "@tanstack/react-table";
import type { Review } from "@/features/review/reviewApi";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Star } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Check, X, Trash } from "lucide-react";
import { useApproveReviewMutation, useDeleteReviewMutation } from "@/features/review/reviewApi";
import { toast } from "sonner";

const ActionCell = ({ review }: { review: Review }) => {
    const [approveReview] = useApproveReviewMutation();
    const [deleteReview] = useDeleteReviewMutation();

    const handleApprove = async (approve: boolean) => {
        try {
            await approveReview({ reviewId: review.id, approve }).unwrap();
            toast.success(`Review ${approve ? "approved" : "rejected"} successfully`);
        } catch (error) {
            toast.error("Action failed");
        }
    };

    const handleDelete = async () => {
        if (confirm("Are you sure you want to delete this review?")) {
            try {
                await deleteReview({ reviewId: review.id, productId: review.productId }).unwrap();
                toast.success("Review deleted successfully");
            } catch (error) {
                toast.error("Delete failed");
            }
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                {!review.isApproved ? (
                    <DropdownMenuItem onClick={() => handleApprove(true)}>
                        <Check className="mr-2 h-4 w-4 text-green-600" />
                        Approve
                    </DropdownMenuItem>
                ) : (
                    <DropdownMenuItem onClick={() => handleApprove(false)}>
                        <X className="mr-2 h-4 w-4 text-orange-600" />
                        Reject
                    </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export const columns: ColumnDef<Review>[] = [
    {
        accessorKey: "product",
        header: "Product",
        cell: ({ row }) => {
            const product = row.original.product;
            return (
                <div className="flex flex-col text-left">
                    <span className="font-medium text-sm truncate max-w-[150px]">{product?.name || "N/A"}</span>
                    <span className="text-xs text-muted-foreground uppercase">{product?.slug || ""}</span>
                </div>
            );
        },
    },
    {
        accessorKey: "user",
        header: "Customer",
        cell: ({ row }) => {
            const user = row.original.user;
            return (
                <div className="flex flex-col text-left">
                    <span className="font-medium text-sm">{user?.firstName} {user?.lastName}</span>
                </div>
            );
        },
    },
    {
        accessorKey: "rating",
        header: "Rating",
        cell: ({ row }) => {
            const rating = row.original.rating;
            return (
                <div className="flex items-center gap-1 font-bold">
                    {rating} <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                </div>
            );
        },
    },
    {
        accessorKey: "comment",
        header: "Comment",
        cell: ({ row }) => (
            <div className="max-w-[200px] truncate text-sm italic text-left">
                "{row.getValue("comment")}"
            </div>
        ),
    },
    {
        accessorKey: "isApproved",
        header: "Status",
        cell: ({ row }) => {
            const isApproved = row.original.isApproved;
            return (
                <Badge variant={isApproved ? "default" : "secondary"}>
                    {isApproved ? "Approved" : "Pending"}
                </Badge>
            );
        },
    },
    {
        accessorKey: "createdAt",
        header: "Date",
        cell: ({ row }) => format(new Date(row.original.createdAt), "dd/MM/yyyy"),
    },
    {
        id: "actions",
        cell: ({ row }) => <ActionCell review={row.original} />,
    },
];
