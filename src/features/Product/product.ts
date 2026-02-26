import { axiosBaseQuery } from "@/app/axiosBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Product"],
  endpoints: (builder) => ({
    // Authentication endpoints
    products: builder.query({
      query: (params = {}) => ({
        url: "/products",
        method: "GET",
        params,
      }),
      providesTags: ["Product"],
    }),

    product: builder.query({
      query: (id) => ({
        url: `/products/${id}`,
        method: "GET",
      }),
      providesTags: ["Product"],
    }),

    featureProduct: builder.query({
      query: () => ({
        url: `/products/featured`,
        method: "GET",
      }),
      providesTags: ["Product"],
    }),

    newArrivalProduct: builder.query({
      query: () => ({
        url: `/products/new-arrivals`,
        method: "GET",
      }),
      providesTags: ["Product"],
    }),

    topRatedProduct: builder.query({
      query: () => ({
        url: `/products/top-rated`,
        method: "GET",
      }),
      providesTags: ["Product"],
    }),

    sameCategoryProduct: builder.query({
      query: (id) => ({
        url: `/products/${id}/related`,
        method: "GET",
      }),
      providesTags: ["Product"],
    }),

    slugProduct: builder.query({
      query: (slug) => ({
        url: `/products/slug/${slug}`,
        method: "GET",
      }),
      providesTags: ["Product"],
    }),

    createProduct: builder.mutation({
      query: (data) => ({
        url: "/products",
        method: "POST",
        data,
      }),
      invalidatesTags: ["Product"],
    }),

    updateProduct: builder.mutation({
      query: ({ id, data }) => ({
        url: `/products/${id}`,
        method: "PUT",
        data: data,
      }),
      invalidatesTags: ["Product"],
    }),

    updateProductStock: builder.mutation({
      query: ({ id, status }) => ({
        url: `/products/${id}/stock`,
        method: "PATCH",
        data: { status },
      }),
      invalidatesTags: ["Product"],
    }),

    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),
  }),
});

export const {
  useProductsQuery,
  useProductQuery,
  useFeatureProductQuery,
  useNewArrivalProductQuery,
  useTopRatedProductQuery,
  useSameCategoryProductQuery,
  useSlugProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useUpdateProductStockMutation,
  useDeleteProductMutation,
} = productsApi;
