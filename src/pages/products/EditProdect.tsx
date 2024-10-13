import React, { useState, useEffect } from "react";
import PageTitle from "@/components/PageTitle";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axiosInstance from "@/utils/AxiosInstance";
import Spinner from "@/components/Spinner";
import { useMutation, useQuery } from "@tanstack/react-query";

// Main component for EditProductPage
const EditProduct = () => {
  const location = useLocation();
  const record = location.state || {}; // Handle case where location.state might be undefined
  const [name, setName] = useState<string | null>(record.name || ""); // Default to empty string if name is not provided
  const [description, setDescription] = useState<string | null>(record.description || ""); // Default to empty string
  const [price, setPrice] = useState<number | null>(record.price || null); // Default to null
  const [uploadImage, setUploadImage] = useState<File | null>(null); // Handle file uploads
  const [uploadImageUrl, setUploadImageUrl] = useState<string | null>(record.image || null); // Default to null
  const [categoryIds, setCategoryIds] = useState<string[]>(record.categoryIds || []); // Initialize as empty array
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // Get the product ID from the URL

  // Fetch categories
  const { data: categories, isLoading: loadingCategories } = useQuery({
    queryKey: ["category"],
    queryFn: async () => {
      const res = await axiosInstance.get("/category");
      return res.data;
    },
  });

  // Fetch the existing product details
  const { data: product, isLoading: loadingProduct } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/product/${id}`);
      return res.data;
    },
    enabled: !!id, // Only run this query if id is available
  });

  // Mutation to edit an existing product
  const mutation = useMutation({
    mutationFn: async (updatedProduct: {
      name: string;
      description: string;
      price: number;
      imageUrl?: string; // Ensure imageUrl is optional
      categoryIds: string[];
    }) => {
      return await axiosInstance.patch(`/product/${id}`, updatedProduct);
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
      console.log(product)
      setName(product.name || ""); // Ensure name is always a string
      setDescription(product.description || ""); // Ensure description is always a string
      setPrice(product.price || null); // Ensure price is handled properly
      setUploadImageUrl(`http://localhost:3000${product.imageUrl}` || null); // Set the image URL
      setCategoryIds(product.categoryIds || []); // Set categoryIds to an array
    }
  }, [product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous error

    if (categoryIds.length === 0) {
      setError("Please select at least one category.");
      return;
    }

    mutation.mutate({
      name: name || "", // Ensure name is not null before passing it to the mutation
      description: description || "", // Ensure description is not null before passing it to the mutation
      price: Number(price) || 0, // Handle price conversion safely
      imageUrl: uploadImageUrl || '', // Use the image URL from state
      categoryIds: categoryIds, // Ensure categoryIds is always an array
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
              value={price || ""}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="border p-2 rounded"
              required
              disabled={mutation.isPending}
            />
          </div>

          {/* Upload Image */}
          <div className="mb-4">
            <label
              htmlFor="upload-image"
              className="block text-sm font-medium text-gray-700"
            >
              Upload Image
            </label>
            {uploadImageUrl && (
              <div className="p-2">
                <img width={100} src={uploadImageUrl} alt="Uploaded preview" />
              </div>
            )}
            <input
              type="file"
              id="upload-image"
              onChange={(e) => {
                if (e.target.files) {
                  const file = e.target.files[0];
                  setUploadImage(file);
                  setUploadImageUrl(URL.createObjectURL(file)); // Create a preview URL for the uploaded image
                }
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
