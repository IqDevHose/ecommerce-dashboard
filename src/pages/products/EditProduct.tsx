import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import PageTitle from "@/components/PageTitle";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "@/utils/AxiosInstance";
import Spinner from "@/components/Spinner";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import CreatableSelect from "react-select/creatable";
import { ActionMeta, MultiValue } from 'react-select';
import { Switch } from "@/components/ui/switch";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().nonnegative("Price must be a non-negative number"),
  categories: z.array(z.string()).nonempty("At least one category is required"),
  published: z.boolean(),
});

type FormData = z.infer<typeof schema>;

interface CategoryOption {
  value: string;
  label: string;
}

const EditProduct = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { control, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const { data: product } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/product/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        description: product.description,
        price: product.price,
        categories: product.categories,
        published: product.published,
      });
      setImagePreview(product.image ? product.image : null);
    }
  }, [product, reset]);

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      let imageBase64 = '';
      if (image) {
        imageBase64 = await convertToBase64(image);
      }

      const productData = {
        ...data,
        image: imageBase64 || undefined,
      };

      await axiosInstance.put(`/product/${id}`, productData);
    },
    onSuccess: () => {
      navigate("/products");
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };

  const { data: categories_data = [], isPending: loadingCategories } = useQuery<CategoryOption[]>({
    queryKey: ["category"],
    queryFn: async () => {
      const res = await axiosInstance.get("/category");
      return res.data.map((category: { id: string; name: string }) => ({
        value: category.id,
        label: category.name,
      }));
    },
  });

  const handleCategoryChange = (
    newValue: MultiValue<CategoryOption>,
    actionMeta: ActionMeta<CategoryOption>
  ) => {
    const selectedCategories = newValue.map(option => option.label);
    return selectedCategories;
  };

  return (
    <div className="p-10 flex flex-col gap-5 w-full">
      <PageTitle title="Edit Product" />
      {mutation.error && <div className="text-red-500">{(mutation.error as Error).message}</div>}
      {product ? (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="name">Name</label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input {...field} id="name" type="text" disabled={mutation.isPending} className={`${errors.name ? 'border-red-500' : ''}`} />
              )}
            />
            {errors.name && <p className="text-red-500">{errors.name.message}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="description">Description</label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Textarea {...field} id="description" disabled={mutation.isPending} className={`${errors.description ? 'border-red-500' : ''}`} />
              )}
            />
            {errors.description && <p className="text-red-500">{errors.description.message}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="price">Price</label>
            <Controller
              name="price"
              control={control}
              render={({ field }) => (
                <Input {...field} id="price" type="number" step="0.01" disabled={mutation.isPending} className={`${errors.price ? 'border-red-500' : ''}`} />
              )}
            />
            {errors.price && <p className="text-red-500">{errors.price.message}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="categories">Categories</label>
            <Controller
              name="categories"
              control={control}
              render={({ field }) => (
                loadingCategories ? (
                  <Spinner size="md" />
                ) : (
                  <CreatableSelect
                    isMulti
                    isDisabled={mutation.isPending}
                    options={categories_data}
                    value={field.value ? field.value.map(category => ({
                      value: category,
                      label: category
                    })) : []}
                    onChange={(newValue, actionMeta) => {
                      const selectedCategories = handleCategoryChange(newValue, actionMeta);
                      field.onChange(selectedCategories);
                    }}
                    isLoading={loadingCategories}
                    placeholder="Select or create categories"
                  />
                )
              )}
            />
            {errors.categories && <p className="text-red-500">{errors.categories.message}</p>}
          </div>

          <div className="flex items-center space-x-2">
            <Controller
              name="published"
              control={control}
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={mutation.isPending}
                />
              )}
            />
            <label htmlFor="published" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Published
            </label>
          </div>

          <div className="flex flex-col gap-2">
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover" />
            )}
            <label htmlFor="image">Product Image</label>
            <Input
              id="image"
              type="file"
              onChange={handleImageChange}
              className="border p-2 rounded"
              accept="image/*"
              disabled={mutation.isPending}
            />
          </div>

          <div className="flex justify-between items-center">
            <Button type="submit" variant="default" disabled={mutation.isPending}>
              {mutation.isPending ? <Spinner size="sm" /> : "Update Product"}
            </Button>
          </div>
        </form>
      ) : (
        <Spinner size="lg" />
      )}
    </div>
  );
};

export default EditProduct;
