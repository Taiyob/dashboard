import { axiosBaseQuery } from "@/app/axiosBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

export const categoriesApi = createApi({
  reducerPath: "categoriesApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Category"],
  endpoints: (builder) => ({
    // Authentication endpoints
    categories: builder.query({
      query: (params = {}) => ({
        url: "/categories",
        method: "GET",
        params,
        //params: { ...params },
      }),
      providesTags: ["Category"],
    }),

    plan: builder.query({
      query: (id) => ({
        url: `/plans/${id}`,
        method: "GET",
      }),
      providesTags: ["Category"],
    }),

    createCategory: builder.mutation({
      query: (data) => ({
        url: "/categories",
        method: "POST",
        data,
      }),
      invalidatesTags: ["Category"],
    }),

    updateCategory: builder.mutation({
      query: ({ id, data }) => ({
        url: `/categories/${id}`,
        method: "PUT",
        data: data,
      }),
      invalidatesTags: ["Category"],
    }),

    updateCategoryStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/categories/${id}/toggle-active`,
        method: "PATCH",
        data: { status },
      }),
      invalidatesTags: ["Category"],
    }),

    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category"],
    }),
  }),
});

export const {
  useCategoriesQuery,
  usePlanQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useUpdateCategoryStatusMutation,
  useDeleteCategoryMutation,
} = categoriesApi;
