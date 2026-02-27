import { axiosBaseQuery } from '@/app/axiosBaseQuery';
import { createApi } from '@reduxjs/toolkit/query/react';

export const orderApi = createApi({
    reducerPath: 'orderApi',
    baseQuery: axiosBaseQuery(),
    tagTypes: ['Orders'],
    endpoints: builder => ({
        getOrders: builder.query({
            query: () => ({
                url: '/orders/admin/all',
                method: 'GET',
            }),
            providesTags: ['Orders'],
        }),
        updateOrderStatus: builder.mutation({
            query: ({ id, status }) => ({
                url: `/orders/${id}/status`,
                method: 'PATCH',
                data: { status },
            }),
            invalidatesTags: ['Orders'],
        }),
    }),
});

export const {
    useGetOrdersQuery,
    useUpdateOrderStatusMutation,
} = orderApi;
