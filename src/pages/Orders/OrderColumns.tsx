import type { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, CheckCircle } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { formatDate } from '@/utils/formatDate';

export const createColumns = (updateStatus: any): ColumnDef<any>[] => [
    {
        accessorKey: 'orderNumber',
        header: 'Order #',
        cell: ({ row }) => (
            <div className="font-medium">{row.original.orderNumber}</div>
        ),
    },
    {
        accessorKey: 'user',
        header: 'Customer',
        cell: ({ row }) => {
            const user = row.original.user;
            return (
                <div className="flex flex-col">
                    <span className="text-sm font-medium">{user?.displayName || 'N/A'}</span>
                    <span className="text-xs text-muted-foreground">{user?.email || 'N/A'}</span>
                </div>
            );
        },
    },
    {
        accessorKey: 'grandTotal',
        header: 'Total',
        cell: ({ row }) => (
            <div className="font-medium">
                {row.original.grandTotal} BDT
            </div>
        ),
    },
    {
        accessorKey: 'paymentStatus',
        header: 'Payment',
        cell: ({ row }) => {
            const status = row.original.paymentStatus;
            return (
                <Badge variant={status === 'paid' ? 'default' : 'secondary'} className="capitalize">
                    {status}
                </Badge>
            );
        },
    },
    {
        accessorKey: 'status',
        header: 'Order Status',
        cell: ({ row }) => {
            const status = row.original.status;
            let variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'outline';

            switch (status) {
                case 'delivered': variant = 'default'; break;
                case 'pending': variant = 'secondary'; break;
                case 'processing': variant = 'secondary'; break;
                case 'shipped': variant = 'secondary'; break;
                case 'cancelled': variant = 'destructive'; break;
            }

            return (
                <Badge variant={variant} className="capitalize">
                    {status}
                </Badge>
            );
        },
    },
    {
        accessorKey: 'createdAt',
        header: 'Date',
        cell: ({ row }) => (
            <div className="text-sm">{formatDate(row.original.createdAt)}</div>
        ),
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const order = row.original;

            return (
                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => {
                                navigator.clipboard.writeText(order.orderNumber);
                                toast.success('Order number copied');
                            }}>
                                Copy Order Number
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {order.status !== 'delivered' && order.status !== 'cancelled' && (
                                <DropdownMenuItem onClick={() => {
                                    updateStatus({ id: order.id, status: 'delivered' })
                                        .unwrap()
                                        .then(() => toast.success('Order marked as delivered'))
                                        .catch(() => toast.error('Failed to update status'));
                                }}>
                                    <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                                    Mark as Delivered
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => {
                                updateStatus({ id: order.id, status: 'processing' })
                                    .unwrap()
                                    .then(() => toast.success('Order status changed to processing'))
                                    .catch(() => toast.error('Failed to update status'));
                            }}>
                                Mark as Processing
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            );
        },
    },
];
