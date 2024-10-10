import { DataTable } from "@/components/DataTable";
import Options from "@/components/Options";
import PageTitle from "@/components/PageTitle";
import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/utils/AxiosInstance";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import ConfirmationModal from "@/components/ConfirmationModal";

// Define the Product type
type Product = {
  id: string;
  name: string;
  category: string;  // Ensure this matches the API response structure
  price: string;
  stock: number;
};

// Main component for ProductsPage
export default function ProductsPage() {
  const [userSearch, setUserSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{ id: string; name: string } | null>(null);

  // Query to fetch products
  const queryClient = useQueryClient();
  const {
    data: products,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await axiosInstance.get("/product");
      console.log("Fetched products:", res.data); // Log the fetched data
      return res.data;
    },
    refetchOnWindowFocus: true, // Automatically refetch on window focus
  });

  // Define the columns for the DataTable
  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "name",
      header: "Product Name",
      cell: ({ row }) => (
        <div className="flex gap-2 items-center">
          <img
            className="h-10 w-10"
            src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${row.getValue("name")}`}
            alt="product-image"
          />
          <p>{row.getValue("name")}</p>
        </div>
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
    },
    {
      accessorKey: "price",
      header: "Price",
    },
    {
      accessorKey: "stock",
      header: "Stock",
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const id = row.original.id; // Access the product ID
        const name = row.original.name; // Access the product name

        return (
          <div className="flex gap-2">
            {/* Link to Edit product */}
            <Link to={`/edit-product/${id}`}>
              <Button variant="outline" size="sm">Edit</Button>
            </Link>
            {/* Button to Delete product */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedProduct({ id, name }); // Set selected product for deletion
                setModalOpen(true); // Open confirmation modal
              }}
            >
              Delete
            </Button>
          </div>
        );
      },
    },
  ];

  // Loading state
  if (isLoading)
    return (
      <div className="flex justify-center items-center h-full self-center mx-auto">
        <Spinner size="md" />
      </div>
    );

  // Error state
  if (error)
    return (
      <div className="flex justify-center items-center h-full self-center mx-auto">
        Error loading products
      </div>
    );

  // Search functionality
  const filteredData = products?.filter((product: Product) =>
    product?.name?.toLowerCase().includes(userSearch.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    try {
      // Optionally fetch the product to confirm it exists
      const response = await axiosInstance.get(`/product/${id}`);
      if (!response.data) {
        console.error('Product not found:', id);
        return;
      }

      // Delete the product
      await axiosInstance.delete(`/product/${id}`);

      // Optionally update the local state to reflect the deletion
      setModalOpen(false); // Close modal after deletion
      setSelectedProduct(null); // Clear selected product

      // Invalidate and refetch the products
      queryClient.invalidateQueries<Product[]>({ queryKey: ["products"] }); // Refetch products to update the list
    } catch (err) {
      console.error("Failed to delete product:", err);
    }
  };

  return (
    <div className="flex flex-col overflow-hidden p-10 gap-5 w-full">
      <PageTitle title="Products" />
      <Options
        haveSearch={true}
        searchValue={userSearch}
        setSearchValue={setUserSearch}
        buttons={[
          <Link to={"/new-product"} key="add-product">
            <Button variant={"outline"}>Add Product</Button>
          </Link>,
        ]}
      />

      <DataTable
        editLink="/edit-product"
        columns={columns} // Pass columns directly
        data={filteredData} handleDelete={function (id: string): void {
          throw new Error("Function not implemented.");
        } }      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={modalOpen}
        onClose={() => {
          console.log("Closing modal");
          setModalOpen(false);
        }}
        onConfirm={() => {
          if (selectedProduct) {
            console.log("Confirming deletion for:", selectedProduct);
            handleDelete(selectedProduct.id);
          }
        }}
        message={`Are you sure you want to delete the product "${selectedProduct?.name}"?`}
      />
    </div>
  );
}
