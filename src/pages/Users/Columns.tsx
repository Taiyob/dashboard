import type { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ActivitySquare, Key, MoreHorizontal, Trash } from 'lucide-react';
import { formatDate } from '@/utils/formatDate';
import {
  useUpdateUserStatusMutation,
  useDeleteUserMutation,
} from '@/features/users/userApi';

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

import defaultAvatar from '@/assets/default-image.jpg';

import type { IUser } from './type';

const ActionCell = ({ user }: { user: IUser }) => {
  const [updateStatus] = useUpdateUserStatusMutation();
  const [deleteUser] = useDeleteUserMutation();

  const handleStatusChange = async (newStatus: string) => {
    if (confirm(`Are you sure you want to change status to ${newStatus}?`)) {
      await updateStatus({ userId: user.id, status: newStatus });
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this user?')) {
      await deleteUser(user.id);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="py-3">
        {user.status === 'active' ? (
          <DropdownMenuItem
            className="text-yellow-600 cursor-pointer"
            onClick={() => handleStatusChange('suspended')}
          >
            <Key /> Deactivate
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            className="text-green-600 cursor-pointer"
            onClick={() => handleStatusChange('active')}
          >
            <ActivitySquare /> Activate
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="text-destructive cursor-pointer"
          onClick={handleDelete}
        >
          <Trash /> Delete User
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const columns: ColumnDef<IUser>[] = [
  // ... (keeping other columns the same)
  {
    header: 'User',
    cell: ({ row }) => {
      const user = row.original;
      const avatarSrc = user.avatarUrl || defaultAvatar;

      return (
        <div className="flex items-center gap-3">
          <img
            src={avatarSrc}
            alt={user.displayName}
            className="h-10 w-10 rounded-full object-cover border"
            onError={(e) => {
              e.currentTarget.src = defaultAvatar;
            }}
          />
          <div className="flex flex-col">
            <span className="font-medium leading-none">{user.displayName}</span>
            <span className="text-xs text-muted-foreground">{user.email}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'phoneNumber',
    header: 'Phone',
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => {
      const role = row.original.role;
      const roleColor: Record<typeof role, string> = {
        admin: 'bg-purple-600',
        employee: 'bg-blue-600',
        subscriber: 'bg-gray-500',
      };
      return <Badge className={`${roleColor[role]} text-white`}>{role}</Badge>;
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status;
      return status === 'active' ? (
        <Badge className="bg-green-600 text-white">active</Badge>
      ) : (
        <Badge variant="outline">inactive</Badge>
      );
    },
  },
  {
    header: 'Email Verified',
    cell: ({ row }) =>
      row.original.emailVerifiedAt ? (
        <Badge className="bg-green-600 text-white">Verified</Badge>
      ) : (
        <Badge variant="outline">No</Badge>
      ),
  },
  {
    accessorKey: 'designation',
    header: 'Designation',
    cell: ({ row }) =>
      row.original.designation ?? (
        <span className="text-muted-foreground">none</span>
      ),
  },
  {
    accessorKey: 'createdAt',
    header: 'Joined',
    cell: ({ row }) => formatDate(row.original.createdAt),
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <ActionCell user={row.original} />,
  },
];
