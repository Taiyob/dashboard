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
import type { IProduct } from "./type";
import EditProduct from "./EditProduct";
import { useDeleteProductMutation } from "@/features/Product/product";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

// import PlanStatusCell from "./PlanStatusCell";
// import EditPlan from "./EditPlan";

export const columns: ColumnDef<IProduct>[] = [
  //  SL
  {
    id: "sl",
    header: "#",
    cell: ({ row, table }) => {
      const pageIndex = table.getState().pagination.pageIndex;
      const pageSize = table.getState().pagination.pageSize;

      return pageIndex * pageSize + row.index + 1;
    },
  },

  //  Product
  {
    header: "Product",
    cell: ({ row }) => {
      const product = row.original;

      return (
        <div className="flex items-center gap-3 max-w-[400px]">
          <div className="h-10 w-10 rounded-md border overflow-hidden flex-shrink-0">
            {product.featuredImage ? (
              <img
                src={product.featuredImage}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-muted flex items-center justify-center text-[10px] text-muted-foreground text-center p-1">
                No image
              </div>
            )}
          </div>
          <div className="flex flex-col truncate">
            <span className="font-medium truncate">{product.name}</span>
            <span className="text-xs text-muted-foreground line-clamp-1">
              {product.description}
            </span>
          </div>
        </div>
      );
    },
  },

  //  Price
  {
    header: "Price",
    cell: ({ row }) => {
      const product = row.original;

      return (
        <div className="flex flex-col">
          <span className="font-medium">${product.price}</span>
          {product.discountPrice > 0 && (
            <span className="text-xs text-muted-foreground line-through">
              ${product.discountPrice}
            </span>
          )}
        </div>
      );
    },
  },

  //  Billing
  //   {
  //     accessorKey: 'billingCycle',
  //     header: 'Billing',
  //     cell: ({row}) => (
  //       <Badge variant="outline">{row.original.billingCycle}</Badge>
  //     ),
  //   },

  //  Features
  //   {
  //     header: 'Features',
  //     cell: ({row}) => {
  //       const features = row.original.features as string[];

  //       if (!features?.length) {
  //         return <span className="text-muted-foreground pl-2">none</span>;
  //       }

  //       return (
  //         <DropdownMenu>
  //           <DropdownMenuTrigger asChild>
  //             <Badge variant="secondary" className="cursor-pointer select-none">
  //               {features.length} features{' '}
  //               <ChevronsDown className="text-primary" />
  //             </Badge>
  //           </DropdownMenuTrigger>

  //           <DropdownMenuContent align="start" className="max-w-[300px]">
  //             {features.map((feature) => (
  //               <DropdownMenuItem key={feature}>
  //                 <ChevronsRight className="text-primary" />
  //                 {feature}
  //               </DropdownMenuItem>
  //             ))}
  //           </DropdownMenuContent>
  //         </DropdownMenu>
  //       );
  //     },
  //   },

  //  Highlights

  //   {
  //     header: 'Highlights',
  //     cell: ({row}) => {
  //       const l = row.original.limits;

  //       const highlights = [
  //         l.enableAPI && 'API Access',
  //         l.enableIntegrations && 'Integrations',
  //         l.enablePrioritySupport && 'Priority Support',
  //         l.enableAdvancedAnalytics && 'Advanced Analytics',
  //         l.enableMultiSite && 'Multi-site',
  //       ].filter(Boolean) as string[];

  //       if (!highlights.length) {
  //         return <span className="text-muted-foreground pl-2">none</span>;
  //       }

  //       return (
  //         <DropdownMenu>
  //           <DropdownMenuTrigger asChild>
  //             <Badge variant="secondary" className="cursor-pointer select-none">
  //               View
  //               <ChevronsDown className="text-primary" />
  //             </Badge>
  //           </DropdownMenuTrigger>

  //           <DropdownMenuContent align="start">
  //             {highlights.map((item) => (
  //               <DropdownMenuItem key={item}>
  //                 <ChevronsRight className="text-primary" />
  //                 {item}
  //               </DropdownMenuItem>
  //             ))}
  //           </DropdownMenuContent>
  //         </DropdownMenu>
  //       );
  //     },
  //   },

  //  Status

  //   {
  //     accessorKey: 'status',
  //     header: 'Status',
  //     cell: ({row}) => (
  //       <PlanStatusCell
  //         planId={row.original.id}
  //         currentStatus={row.original.status}
  //       />
  //     ),
  //   },

  //  Category
  {
    header: "Category",
    cell: ({ row }) => (
      <span className="capitalize">{row.original.category?.name || "N/A"}</span>
    ),
  },

  //  Created
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => formatDate(row.original.createdAt),
  },

  //  Actions
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];

const CellAction = ({ data }: { data: IProduct }) => {
  const [open, setOpen] = useState(false);
  const [deleteProduct, { isLoading }] = useDeleteProductMutation();

  const onDelete = async () => {
    try {
      console.log("[Delete Action] Attempting to delete product with ID:", data.id);
      const res = await deleteProduct(data.id).unwrap();
      console.log("[Delete Action] Response from server:", res);
      toast.success("Product deleted successfully");
      setOpen(false);
    } catch (err: any) {
      console.error("[Delete Action] Error:", err);
      toast.error(err?.data?.message || "Failed to delete product");
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
              product "{data.name}" from the servers.
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
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="py-3">
          <EditProduct
            item={data}
            trigger={
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="cursor-pointer"
              >
                <Edit className="mr-2 h-4 w-4" /> Edit Product
              </DropdownMenuItem>
            }
          />

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => setOpen(true)}
            className="text-destructive cursor-pointer"
          >
            <Trash className="mr-2 h-4 w-4" /> Delete Product
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
