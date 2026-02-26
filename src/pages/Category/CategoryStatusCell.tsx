"use client";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useUpdateCategoryStatusMutation } from "@/features/Category/category";
import { ChevronDown, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Props {
    categoryId: string;
    isActive: boolean;
}

export default function CategoryStatusCell({ categoryId, isActive }: Props) {
    const [updateStatus, { isLoading }] = useUpdateCategoryStatusMutation();

    const handleToggle = async () => {
        try {
            console.log("[Category Status Toggle] ID:", categoryId, "New Status:", !isActive);
            const res = await updateStatus({
                id: categoryId,
                status: !isActive,
            }).unwrap();
            console.log("[Category Status Toggle] Success:", res);

            if (res?.success) {
                toast.success("Category status updated successfully");
            }
        } catch (err: any) {
            console.error("[Category Status Toggle] Error:", err);
            toast.error(err?.data?.message || "Failed to update category status");
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Badge
                    variant="secondary"
                    className={`cursor-pointer flex items-center gap-1 select-none ${isActive
                        ? "bg-green/10 text-green hover:bg-green/20"
                        : "bg-destructive/10 text-destructive hover:bg-destructive/20"
                        }`}
                >
                    {isLoading ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                    ) : isActive ? (
                        "Active"
                    ) : (
                        "Inactive"
                    )}
                    <ChevronDown className="h-3 w-3" />
                </Badge>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={handleToggle}>
                    Mark as {isActive ? "Inactive" : "Active"}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
