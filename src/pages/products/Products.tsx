import { DataTable } from "@/components/DataTable";
import Options from "@/components/Options";
import PageTitle from "@/components/PageTitle";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/utils/AxiosInstance";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import ConfirmationModal from "@/components/ConfirmationModal";
import Loading from "@/components/Loading";
import { PencilIcon, PlusIcon, TrashIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Category = {
  id: string;
  name: string;
};

// Define the Product type
type Product = {
  id: string;
  name: string;
  image: string; // base64
  category: Category[]; // Ensure this matches the API response structure
  price: string;
  stock: number;
};

// Main component for ProductsPage
export default function ProductsPage() {
  const [userSearch, setUserSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // Query to fetch products
  const queryClient = useQueryClient();
  const {
    data: products,
    isPending,
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
          <Avatar className="h-16 w-16">
            <AvatarImage src={row.original.image} alt="product-image" />
            <AvatarFallback>
              {row.original.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <p>{row.getValue("name")}</p>
        </div>
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => {
        const categories = row.original.category;

        return (
          <div className="flex flex-col gap-2">
            <div className="flex gap-2 items-center">
              <div className="flex gap-2">
                {categories.slice(0, 3).map((category: Category) => (
                  <Badge variant={"outline"} key={category.id}>
                    {category.name}
                  </Badge>
                ))}
                {categories.length > 3 && (
                  <Badge variant={"outline"}>
                    <span>...</span>
                  </Badge>
                )}
              </div>
            </div>
          </div>
        );
      },
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
            <Link to={`/edit-product/${id}`} state={{ product: row.original }}>
              <Button variant="ghost" size="icon" className="text-blue-500 hover:text-blue-600">
                <PencilIcon className="h-4 w-4" />
              </Button>
            </Link>
            {/* Button to Delete product */}
            <Button
              variant="ghost"
              size="icon"
              className="text-red-500 hover:text-red-600"
              onClick={() => {
                setSelectedProduct({ id, name }); // Set selected product for deletion
                setModalOpen(true); // Open confirmation modal
              }}
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  // Loading state
  if (isPending) return <Loading />;

  // Error state
  if (error) return <div className="flex justify-center items-center h-full self-center mx-auto">Error loading products</div>;

  // Search functionality
  const filteredData = products?.filter((product: Product) =>
    product?.name?.toLowerCase().includes(userSearch.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    try {
      // Optionally fetch the product to confirm it exists
      const response = await axiosInstance.get(`/product/${id}`);
      if (!response.data) {
        console.error("Product not found:", id);
        return;
      }

      // Delete the product
      await axiosInstance.delete(`/product/${id}`);

      // Optionally update the local state to reflect the deletion
      setModalOpen(false); // Close modal after deletion
      setSelectedProduct(null); // Clear selected product

      // Invalidate and refetch the products
      queryClient.invalidateQueries({ queryKey: ["products"] }); // Refetch products to update the list
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
            <Button variant={"default"} className="flex items-center gap-1">
              <PlusIcon className="w-4 h-4" />
              <span>Add Product</span>
            </Button>
          </Link>,
        ]}
      />

      <DataTable
        editLink="/edit-product"
        columns={columns} // Pass columns directly
        data={filteredData}
        handleDelete={function (id: string): void {
          throw new Error("Function not implemented.");
        }}
      />

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
