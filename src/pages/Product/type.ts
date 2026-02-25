import z from "zod";

export interface IProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice: number;
  shortDescription: string;
  stock: number;
  sku: string;
  images: string[];
  featuredImage: string;
  isFeatured: boolean;
  isNewArrival: boolean;
  status: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  avgRating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export const ProductCreateSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(0, "Price cannot be negative"),
  discountPrice: z.number().min(0, "Discount price cannot be negative"),
  stock: z.number().min(1, "Stock must be at least 1"),
  sku: z.string().min(1, "SKU is required"),
  featuredImage: z.string().url(),
  isFeatured: z.boolean(),
  categoryId: z.string().min(1, "Please select a category"),
});

export const ProductEditSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Product name is required").optional(),
  description: z.string().min(1, "Description is required").optional(),
  price: z.number().min(0, "Price cannot be negative").optional(),
  discountPrice: z
    .number()
    .min(0, "Discount price cannot be negative")
    .optional(),
  stock: z.number().min(1, "Stock must be at least 1").optional(),
  sku: z.string().min(1, "SKU is required").optional(),
  featuredImage: z.string().url().optional(),
  isFeatured: z.boolean().optional(),
  categoryId: z.string().min(1, "Please select a category").optional(),
});

export type ProductCreateType = z.infer<typeof ProductCreateSchema>;
export type ProductEditType = z.infer<typeof ProductEditSchema>;
