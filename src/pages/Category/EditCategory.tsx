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
import { useEffect, useState } from "react";
import { CategoryEditSchema, type CategoryEditType, type ICategory } from "./type";
import { useUpdateCategoryMutation } from "@/features/Category/category";

type Props = {
    item: ICategory;
    trigger: React.ReactNode;
};

const EditCategory = ({ item, trigger }: Props) => {
    const isMobile = useIsMobile();
    const [open, setOpen] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(item.imageUrl);

    const [updateCategory, { isLoading }] = useUpdateCategoryMutation();

    const form = useForm<CategoryEditType>({
        resolver: zodResolver(CategoryEditSchema),
        defaultValues: {
            id: item.id,
            name: item.name,
            description: item.description,
        },
    });

    useEffect(() => {
        if (open) {
            form.reset({
                id: item.id,
                name: item.name,
                description: item.description,
            });
            setImagePreview(item.imageUrl);
        }
    }, [open, item, form]);

    const onSubmit = async (data: CategoryEditType) => {
        try {
            console.log("[Category Update] Submission started for ID:", item.id);
            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("description", data.description);

            if (data.image instanceof File) {
                console.log("[Category Update] Appending new image file");
                formData.append("image", data.image);
            }

            const res = await updateCategory({
                id: item.id,
                data: formData,
            }).unwrap();
            console.log("[Category Update] Success:", res);

            toast.success("Category updated successfully");
            setOpen(false);
        } catch (error: any) {
            console.error("[Category Update] Error:", error);
            toast.error(error?.data?.message || "Failed to update category");
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
                    <DrawerTitle>Edit Category</DrawerTitle>
                    <DrawerDescription>Update category details</DrawerDescription>
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
                                                placeholder="Describe the category..."
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
                        {isLoading ? "Saving..." : "Update Category"}
                    </Button>
                    <DrawerClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
};

export default EditCategory;
