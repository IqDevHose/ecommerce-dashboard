import React, { useState } from "react";
import PageTitle from "@/components/PageTitle";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/utils/AxiosInstance";
import Spinner from "@/components/Spinner";
import { useMutation, useQuery } from "@tanstack/react-query";

// Main component for AddProductPage
const AddProduct = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [imageUrl, setImageUrl] = useState("");
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const { data: categories, isLoading: loadingCategories } = useQuery({
    queryKey: ["category"],
    queryFn: async () => {
      const res = await axiosInstance.get("/category");
      return res.data;
    }
  });
  
  // Mutation to add a new product
  const mutation = useMutation({
    mutationFn: async (newProduct: {
      name: string;
      description: string;
      price: number;
      imageUrl?: string;
      categoryIds: string[];
    }) => {
      return await axiosInstance.post("/product", newProduct);
    },
    onSuccess: () => {
      // Reset form fields
      setName("");
      setDescription("");
      setPrice("");
      setImageUrl("");
      setCategoryIds([]);
      navigate("/products");
    },
    onError: (err: any) => {
      setError(
        err?.response?.data?.message || err.message || "Failed to add product"
      );
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous error

    if (!categoryIds.length) {
      setError("Please select at least one category.");
      return;
    }

    mutation.mutate({
      name,
      description,
      price: Number(price),
      imageUrl,
      categoryIds,
    });
  };

  const handleCategorySelect = (categoryId: string) => {
    // Toggle category selection
    if (categoryIds.includes(categoryId)) {
      setCategoryIds(categoryIds.filter((id) => id !== categoryId));
    } else {
      setCategoryIds([...categoryIds, categoryId]);
    }
  };

  return (
    <div className="p-10 flex flex-col gap-5 w-full">
      <PageTitle title="Add Product" />
      {error && <div className="text-red-500">{error}</div>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
        <div className="flex flex-col gap-2">
          <label htmlFor="price">Price</label>
          <input
            id="price"
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="border p-2 rounded"
            required
            disabled={mutation.isPending}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="imageUrl">Image URL</label>
          <input
            id="imageUrl"
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="border p-2 rounded"
            disabled={mutation.isPending}
          />
        </div>

        {/* Category Selection */}
        <div className="flex flex-col gap-2">
          <label>Categories</label>
          {loadingCategories ? (
            <Spinner size="md" />
          ) : (
            <div className="flex gap-2 flex-wrap">
              {categories?.map((category: { id: string; name: string }) => (
                <label key={category.id} className="flex gap-2 items-center">
                  <input
                    type="checkbox"
                    value={category.id}
                    checked={categoryIds.includes(category.id)}
                    onChange={() => handleCategorySelect(category.id)}
                    disabled={mutation.isPending}
                  />
                  {category.name}
                </label>
              ))}
            </div>
          )}
        </div>

        <Button type="submit" variant="outline" disabled={mutation.isPending}>
          {mutation.isPending ? <Spinner size="sm" /> : "Add Product"}
        </Button>
      </form>
    </div>
  );
};

export default AddProduct;
