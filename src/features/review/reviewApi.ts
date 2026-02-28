import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/app/axiosBaseQuery";

export interface Review {
    id: string;
    userId: string;
    productId: string;
    rating: number;
    comment: string;
    images: string[];
    isApproved: boolean;
    createdAt: string;
    updatedAt: string;
    user: {
        id: string;
        firstName: string;
        lastName: string;
        avatarUrl: string | null;
    };
    product: {
        id: string;
        name: string;
        slug: string;
        featuredImage: string | null;
    };
}

export const reviewApi = createApi({
    reducerPath: "reviewApi",
    baseQuery: axiosBaseQuery(),
    tagTypes: ["Review"],
    endpoints: (builder) => ({
        getReviews: builder.query<{ success: boolean; data: Review[]; meta: any }, { page?: number; limit?: number; isApproved?: boolean }>({
            query: (params) => ({
                url: "/admin/reviews",
                method: "GET",
                params,
            }),
            providesTags: ["Review"],
        }),
        approveReview: builder.mutation<{ success: boolean; message: string }, { reviewId: string; approve: boolean }>({
            query: ({ reviewId, approve }) => ({
                url: `/admin/reviews/${reviewId}/approve`,
                method: "PATCH",
                data: { approve },
            }),
            invalidatesTags: ["Review"],
        }),
        deleteReview: builder.mutation<{ success: boolean; message: string }, { reviewId: string; productId: string }>({
            query: ({ reviewId, productId }) => ({
                url: `/products/${productId}/reviews/${reviewId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Review"],
        }),
    }),
});

export const {
    useGetReviewsQuery,
    useApproveReviewMutation,
    useDeleteReviewMutation,
} = reviewApi;
