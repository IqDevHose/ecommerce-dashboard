// EditProduct.tsx
import React, { useState, useEffect, FormEvent } from "react";
import {
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import PageTitle from "@/components/PageTitle";
import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import CreatableSelect from "react-select/creatable";
import axiosInstance from "@/utils/AxiosInstance";
import * as RadixProgress from "@radix-ui/react-progress";

// Define interfaces
interface CategoryOption {
  value: string;
  label: string;
}

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryIds: string[];
  createdAt: string;
  updatedAt: string;
}

const EditProduct: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const queryClient = useQueryClient();

  // Retrieve the passed state (product data)
  const initialProduct: Product | undefined =
    location.state as Product | undefined;

  // State Variables
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<number | "">("");
  const [uploadImage, setUploadImage] = useState<File | null>(null);
  const [uploadImageUrl, setUploadImageUrl] = useState<string | null>(null);
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);

  // Fetch Categories and map to CategoryOption[]
  const {
    data: categories = [],
    isLoading: loadingCategories,
    isError: isErrorCategories,
    error: categoriesError,
  } = useQuery<CategoryOption[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await axiosInstance.get("/category");
      return res.data.map((category: Category) => ({
        value: category.id,
        label: category.name,
      }));
    },
  });

  // Fetch Existing Product Details, using initialProduct as initialData if available
  const {
    data: product,
    isLoading: loadingProduct,
    isError: isErrorProduct,
    error: productError,
  } = useQuery<Product>({
    queryKey: ["product", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/product/${id}`);
      console.log(res.data);
      return res.data;
    },
    enabled: !!id, // Only run if id is available
    initialData: initialProduct,
    onSuccess: (data: Product) => {
      console.log("Fetched product data:", data);
      setName(data.name || "");
      setDescription(data.description || "");
      setPrice(data.price ?? "");
      setUploadImageUrl(
        data.imageUrl
          ? `${import.meta.env.VITE_API_BASE_URL}${data.imageUrl}`
          : null
      );
      setCategoryIds(data.categoryIds || []);
    },
    onError: (err: any) => {
      setError(
        err?.response?.data?.message ||
          err.message ||
          "Failed to fetch product."
      );
    },
  });

  // Handle cases where id is missing
  useEffect(() => {
    if (!id) {
      setError("Invalid product ID.");
      navigate("/products");
    }
  }, [id, navigate]);

  // Mutation to Edit Product
  const mutation = useMutation({
    mutationFn: (formData: FormData) => {
      return axiosInstance.patch(`/product/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (event) => {
          const percentCompleted = event.total
            ? Math.round((100 * event.loaded) / event.total)
            : 0;
          setProgress(percentCompleted);
        },
      });
    },
    onSuccess: () => {
      // Optionally, you can invalidate and refetch the product data
      queryClient.invalidateQueries(["product", id]);
      navigate("/products");
    },
    onError: (err: any) => {
      setError(
        err?.response?.data?.message ||
          err.message ||
          "Failed to edit product."
      );
      setProgress(0);
    },
  });

  // Cleanup Object URL to Prevent Memory Leaks
  useEffect(() => {
    return () => {
      if (uploadImageUrl && uploadImageUrl.startsWith("blob:")) {
        URL.revokeObjectURL(uploadImageUrl);
      }
    };
  }, [uploadImageUrl]);

  // Handle Form Submission
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    // Validate Category Selection
    if (categoryIds.length === 0) {
      setError("Please select at least one category.");
      return;
    }

    // Validate Required Fields
    if (!name || !description || price === "") {
      setError("Please fill in all required fields.");
      return;
    }

    // Create FormData
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", String(price));
    categoryIds.forEach((id) => formData.append("categoryIds", id));

    if (uploadImage) {
      formData.append("image", uploadImage);
    }

    // Trigger Mutation
    mutation.mutate(formData);
  };

  // Handle Category Selection Changes
  const handleCategoryChange = (
    selectedOptions: CategoryOption[] | null
  ) => {
    const selectedIds = selectedOptions
      ? selectedOptions.map((option) => option.value)
      : [];
    setCategoryIds(selectedIds);
  };

  // Handle Image Upload with Validation
  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setError(null); // Clear previous errors
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Validate File Type
      if (!file.type.startsWith("image/")) {
        setError("Please upload a valid image file.");
        return;
      }

      // Validate File Size (e.g., max 5MB)
      const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSizeInBytes) {
        setError("Image size should be less than 5MB.");
        return;
      }

      setUploadImage(file);
      setUploadImageUrl(URL.createObjectURL(file));
    }
  };

  // Prepare selected categories for CreatableSelect
  const selectedCategories = categories.filter((option) =>
    categoryIds.includes(option.value)
  );

  return (
    <div className="p-10 flex flex-col gap-5 w-full">
      <PageTitle title="Edit Product" />

      {/* Display Error if Any */}
      {error && <div className="text-red-500">{error}</div>}

      {/* Display Error if Fetching Product Failed */}
      {isErrorProduct && (
        <div className="text-red-500">
          {productError?.response?.data?.message ||
            productError.message ||
            "Failed to load product."}
        </div>
      )}

      {/* Display Error if Fetching Categories Failed */}
      {isErrorCategories && (
        <div className="text-red-500">
          {categoriesError?.response?.data?.message ||
            categoriesError.message ||
            "Failed to load categories."}
        </div>
      )}

      {/* Show Spinner if Loading */}
      {(loadingProduct || loadingCategories) ? (
        <Spinner size="md" />
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Name Field */}
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="font-semibold">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={mutation.isLoading}
            />
          </div>

          {/* Description Field */}
          <div className="flex flex-col gap-2">
            <label htmlFor="description" className="font-semibold">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={mutation.isLoading}
            />
          </div>

          {/* Price Field */}
          <div className="flex flex-col gap-2">
            <label htmlFor="price" className="font-semibold">
              Price
            </label>
            <input
              id="price"
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) =>
                setPrice(
                  e.target.value !== "" ? Number(e.target.value) : ""
                )
              }
              className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={mutation.isLoading}
            />
          </div>

          {/* Upload Image */}
          <div className="mb-4">
            <div className="flex gap-4 flex-wrap items-center">
              <label
                htmlFor="upload-image"
                className="block text-sm font-medium text-gray-700"
              >
                Upload Image
              </label>
              {progress > 0 && uploadImage && (
                <div className="flex items-center gap-1">
                  <span className="text-gray-400">{progress}%</span>
                  {/* Radix UI Progress */}
                  <RadixProgress.Root
                    value={progress}
                    max={100}
                    className="relative flex-grow h-2 bg-gray-200 rounded"
                  >
                    <RadixProgress.Indicator
                      className="absolute h-2 bg-blue-600 rounded"
                      style={{ width: `${progress}%` }}
                    />
                  </RadixProgress.Root>
                </div>
              )}
            </div>
            {uploadImageUrl && (
              <div className="p-4">
                <img
                  width={100}
                  src={uploadImageUrl}
                  alt="Uploaded preview"
                  className="object-cover rounded"
                />
              </div>
            )}
            <input
              type="file"
              id="upload-image"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              disabled={mutation.isLoading}
            />
          </div>

          {/* Category Selection */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold">Categories</label>
            {loadingCategories ? (
              <Spinner size="md" />
            ) : (
              <CreatableSelect
                isMulti
                isDisabled={mutation.isLoading}
                options={categories}
                value={selectedCategories}
                onChange={handleCategoryChange}
                isLoading={loadingCategories}
                placeholder="Select or create categories"
                className="react-select-container"
                classNamePrefix="react-select"
              />
            )}
          </div>

          {/* Display Form Submission Error */}
          {error && <div className="text-red-500">{error}</div>}

          {/* Submit Button */}
          <Button
            type="submit"
            variant="outline"
            disabled={mutation.isLoading}
            className="self-start"
          >
            {mutation.isLoading ? <Spinner size="sm" /> : "Edit Product"}
          </Button>
        </form>
      )}
    </div>
  );
};

export default EditProduct;
