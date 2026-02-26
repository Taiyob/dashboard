/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useState } from "react";
import type * as z from "zod";
import { CategoryCreateSchema } from "./type";
import { useCreateCategoryMutation } from "@/features/Category/category";

type CategoryFormInput = z.input<typeof CategoryCreateSchema>;

function CreateCategory({ trigger }: { trigger: React.ReactNode }) {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [createCategory, { isLoading }] = useCreateCategoryMutation();

  const form = useForm<CategoryFormInput>({
    resolver: zodResolver(CategoryCreateSchema),
    defaultValues: {
      name: "",
      description: "",
      // imageUrl is optional → zod will apply default value automatically
    },
  });

  const onSubmit = async (data: CategoryFormInput) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);

      if (data.image instanceof File) {
        formData.append("image", data.image);
      }

      await createCategory(formData).unwrap();

      toast.success("Category created successfully");
      form.reset();
      setImagePreview(null);
      setOpen(false);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.data?.message || "Failed to create category");
    }
  };

  return (
    <Drawer
      direction={isMobile ? "bottom" : "right"}
      open={open}
      onOpenChange={setOpen}
    >
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>

      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Create Category</DrawerTitle>
          <DrawerDescription>
            Add a new category for your products.
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-4 overflow-y-auto">
          <Form {...form}>
            <form className="space-y-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Electronics" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Short description of the category..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="image"
                render={({ field: { onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel>Category Image</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            onChange(file);
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setImagePreview(reader.result as string);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        {...field}
                        value={undefined}
                      />
                    </FormControl>
                    <FormMessage />
                    {imagePreview && (
                      <div className="mt-3">
                        <p className="text-sm text-muted-foreground mb-1">
                          Preview:
                        </p>
                        <img
                          src={imagePreview}
                          alt="Category preview"
                          className="max-h-48 w-full object-contain rounded-md border bg-muted/40"
                        />
                      </div>
                    )}
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>

        <DrawerFooter>
          <Button disabled={isLoading} onClick={form.handleSubmit(onSubmit)}>
            {isLoading ? "Creating..." : "Create Category"}
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default CreateCategory;
