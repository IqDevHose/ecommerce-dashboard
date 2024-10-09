import React, { useState, useEffect } from "react";
import PageTitle from "@/components/PageTitle";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "@/utils/AxiosInstance";
import Spinner from "@/components/Spinner";
import { useMutation, useQuery } from "@tanstack/react-query";

// Main component for EditProductPage
const EditProduct = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [imageUrl, setImageUrl] = useState("");
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // Get the product ID from the URL

  // Fetch categories
  const { data: categories, isLoading: loadingCategories } = useQuery({
    queryKey: ["category"],
    queryFn: async () => {
      const res = await axiosInstance.get("/category");
      return res.data;
    }
  });

  // Fetch the existing product details
  const { data: product, isLoading: loadingProduct } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/product/${id}`);
      return res.data;
    },
    enabled: !!id // Only run this query if id is available
  });

  // Mutation to edit an existing product
  const mutation = useMutation({
    mutationFn: async (updatedProduct: {
      name: string;
      description: string;
      price: number;
      imageUrl?: string;
      categoryIds: string[];
    }) => {
      return await axiosInstance.put(`/product/${id}`, updatedProduct);
    },
    onSuccess: () => {
      navigate("/products");
    },
    onError: (err: any) => {
      setError(
        err?.response?.data?.message || err.message || "Failed to edit product"
      );
    },
  });

  // Populate form fields with product details when product data is fetched
  useEffect(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description);
      setPrice(product.price);
      setImageUrl(product.imageUrl || "");
      setCategoryIds(product.categoryIds || []);
    }
  }, [product]);

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
      <PageTitle title="Edit Product" />
    
      {loadingProduct ? (
        <Spinner size="md" />
      ) : (
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
          {error && <div className="text-red-500">{error}</div>}

          <Button type="submit" variant="outline" disabled={mutation.isPending}>
            {mutation.isPending ? <Spinner size="sm" /> : "Edit Product"}
          </Button>
        </form>
      )}
    </div>
  );
};

export default EditProduct;
