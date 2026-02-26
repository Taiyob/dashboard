import { z } from "zod";

export interface ICategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  parentId: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  children?: ICategory[];
  _count?: {
    products: number;
  };
}

export const CategoryCreateSchema = z.object({
  name: z.string().min(1, "Category name is required"),
  description: z.string().min(1, "Description is required"),
  image: z.any().optional(), // Using z.any() for File object
});

export type CategoryCreateType = z.infer<typeof CategoryCreateSchema>;

export const CategoryEditSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Category name is required"),
  description: z.string().min(1, "Description is required"),
  image: z.any().optional(), // Using z.any() for optional File update
});

export type CategoryEditType = z.infer<typeof CategoryEditSchema>;
