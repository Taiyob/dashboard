import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { formatDate } from "@/utils/formatDate";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { toast } from "sonner";

import type { ICategory } from "./type";
import CategoryStatusCell from "./CategoryStatusCell";
import EditCategory from "./EditCategory";
import { useDeleteCategoryMutation } from "@/features/Category/category";

export const columns: ColumnDef<ICategory>[] = [
  // SL
  {
    id: "sl",
    header: "#",
    cell: ({ row, table }) => {
      const pageIndex = table.getState().pagination.pageIndex;
      const pageSize = table.getState().pagination.pageSize;
      return pageIndex * pageSize + row.index + 1;
    },
  },

  // Category Info
  {
    header: "Category",
    cell: ({ row }) => {
      const category = row.original;
      return (
        <div className="flex items-center gap-3 max-w-[400px]">
          <div className="h-10 w-10 rounded-md border overflow-hidden flex-shrink-0 bg-muted/40">
            {category.imageUrl ? (
              <img
                src={category.imageUrl}
                alt={category.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-[10px] text-muted-foreground text-center p-1">
                No image
              </div>
            )}
          </div>
          <div className="flex flex-col truncate">
            <span className="font-medium truncate">{category.name}</span>
            <span className="text-xs text-muted-foreground line-clamp-1 italic">
              /{category.slug}
            </span>
          </div>
        </div>
      );
    },
  },

  // Description
  {
    header: "Description",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground line-clamp-1 max-w-[300px]">
        {row.original.description || "No description"}
      </span>
    ),
  },

  // Status
  {
    header: "Status",
    cell: ({ row }) => (
      <CategoryStatusCell
        categoryId={row.original.id}
        isActive={row.original.isActive}
      />
    ),
  },

  // Products Count
  {
    header: "Products",
    cell: ({ row }) => (
      <span className="font-medium">{row.original._count?.products || 0}</span>
    ),
  },

  // Created
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => formatDate(row.original.createdAt),
  },

  // Actions
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];

const CellAction = ({ data }: { data: ICategory }) => {
  const [open, setOpen] = useState(false);
  const [deleteCategory, { isLoading }] = useDeleteCategoryMutation();

  const onDelete = async () => {
    try {
      console.log("[Category Delete] Attempting to delete ID:", data.id);
      const res = await deleteCategory(data.id).unwrap();
      console.log("[Category Delete] Success:", res);
      toast.success("Category deleted successfully");
      setOpen(false);
    } catch (err: any) {
      console.error("[Category Delete] Error:", err);
      toast.error(err?.data?.message || "Failed to delete category");
    }
  };

  return (
    <>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              category "{data.name}" and remove it from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                onDelete();
              }}
              disabled={isLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoading ? "Deleting..." : "Continue"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="h-8 w-8 p-0 border-none outline-none focus:ring-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="py-3">
          <EditCategory
            item={data}
            trigger={
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="cursor-pointer"
              >
                <Edit className="mr-2 h-4 w-4" /> Edit Category
              </DropdownMenuItem>
            }
          />

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => setOpen(true)}
            className="text-destructive cursor-pointer"
          >
            <Trash className="mr-2 h-4 w-4" /> Delete Category
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
