import { axiosBaseQuery } from '@/app/axiosBaseQuery';
import { createApi } from '@reduxjs/toolkit/query/react';

export const userApi = createApi({
  reducerPath: 'userApi', // More specific name to avoid conflicts
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Auth', 'User', 'Profile'],
  endpoints: (builder) => ({
    // Authentication endpoints
    users: builder.query({
      query: (params) => ({
        url: '/users/users', // Based on AuthModule mounting /api/users -> authRoutes, and authRoutes having /users
        method: 'GET',
        params: { ...params },
      }),
      providesTags: ['User'],
    }),

    user: builder.query({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'GET',
      }),
      providesTags: ['User'],
    }),

    updateUser: builder.mutation({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: ['User'],
    }),

    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),

    updateUserStatus: builder.mutation({
      query: ({ userId, status }) => ({
        url: `/users/${userId}/status`,
        method: 'PATCH',
        data: { status },
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useUsersQuery,
  useUserQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useUpdateUserStatusMutation,
} = userApi;
