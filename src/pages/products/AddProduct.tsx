import React, { FormEvent, useState, useEffect } from "react";
import PageTitle from "@/components/PageTitle";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/utils/AxiosInstance";
import Spinner from "@/components/Spinner";
import CreatableSelect from "react-select/creatable";
import { useMutation, useQuery } from "@tanstack/react-query";
import * as RadixProgress from "@radix-ui/react-progress";

interface CategoryOption {
  value: string;
  label: string;
}

const AddProduct = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [uploadImage, setUploadImage] = useState<File | null>(null);
  const [uploadImageUrl, setUploadImageUrl] = useState<string | null>(null);
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [progress, setProgress] = useState<number>(0);

  // Fetch categories with default value as empty array
  const { data: categories = [], isPending: loadingCategories } = useQuery<
    CategoryOption[]
  >({
    queryKey: ["category"],
    queryFn: async () => {
      const res = await axiosInstance.get("/category");
      return res.data.map((category: { id: string; name: string }) => ({
        value: category.id,
        label: category.name,
      }));
    },
  });

  // Mutation for submitting the form
  const mutation = useMutation({
    mutationFn: (formData: FormData) => {
      return axiosInstance.post(`/product`, formData, {
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
    onError: (e: any) => {
      console.error(e);
      setError(e?.response?.data?.message || "Failed to add product");
      setProgress(0);
    },
    onSuccess: () => {
      navigate("/products");
    },
  });

  // Cleanup the object URL to prevent memory leaks
  useEffect(() => {
    return () => {
      if (uploadImageUrl && uploadImageUrl.startsWith("blob:")) {
        URL.revokeObjectURL(uploadImageUrl);
      }
    };
  }, [uploadImageUrl]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    // Validate category selection
    if (!categoryIds.length) {
      setError("Please select at least one category.");
      return;
    }

    // Validate required fields
    if (!name || !description || price === "") {
      setError("Please fill in all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", String(price));
    categoryIds.forEach((id) => formData.append("categoryIds", id));

    if (uploadImage) {
      formData.append("image", uploadImage);
    }

    mutation.mutate(formData);
  };

  const handleCategoryChange = (selectedOptions: CategoryOption[] | null) => {
    const selectedIds = selectedOptions
      ? selectedOptions.map((option) => option.value)
      : [];
    setCategoryIds(selectedIds);
  };

  return (
    <div className="p-10 flex flex-col gap-5 w-full">
      <PageTitle title="Add Product" />
      {error && <div className="text-red-500">{error}</div>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Name Field */}
        <div className="flex flex-col gap-2">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 rounded"
            required
            disabled={mutation.isPending}
          />
        </div>

        {/* Description Field */}
        <div className="flex flex-col gap-2">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-2 rounded"
            required
            disabled={mutation.isPending}
          />
        </div>

        {/* Price Field */}
        <div className="flex flex-col gap-2">
          <label htmlFor="price">Price</label>
          <input
            id="price"
            type="number"
            value={price === "" ? "" : price}
            onChange={(e) =>
              setPrice(e.target.value ? Number(e.target.value) : "")
            }
            className="border p-2 rounded"
            required
            disabled={mutation.isPending}
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
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                const file = e.target.files[0];
                setUploadImage(file);
                setUploadImageUrl(URL.createObjectURL(file));
              }
            }}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            disabled={mutation.isPending}
          />
        </div>

        {/* Category Selection */}
        <div className="flex flex-col gap-2">
          <label>Categories</label>
          {loadingCategories ? (
            <Spinner size="md" />
          ) : (
            <CreatableSelect
              isMulti
              isDisabled={mutation.isPending}
              options={categories}
              value={categories.filter((option) =>
                categoryIds.includes(option.value)
              )}
              onChange={handleCategoryChange}
              isPending={loadingCategories}
              placeholder="Select or create categories"
            />
          )}
        </div>

        {/* Error Message */}
        {error && <div className="text-red-500">{error}</div>}

        {/* Submit Button */}
        <Button type="submit" variant="outline" disabled={mutation.isPending}>
          {mutation.isPending ? <Spinner size="sm" /> : "Add Product"}
        </Button>
      </form>
    </div>
  );
};

export default AddProduct;
