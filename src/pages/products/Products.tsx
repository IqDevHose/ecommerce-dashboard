import { DataTable } from "@/components/DataTable";
import Options from "@/components/Options";
import PageTitle from "@/components/PageTitle";
import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/utils/AxiosInstance";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table"; // Ensure you're using @tanstack/react-table in your project
import { useState } from "react";
import { Link } from "react-router-dom";

// Define the Product type
type Product = {
  id: string;
  name: string;
  category: string;
  price: string;
  stock: number;
};

// Define the columns for the DataTable
const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: "Product Name",
    cell: ({ row }) => {
      return (
        <div className="flex gap-2 items-center">
          <img
            className="h-10 w-10"
            src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${row.getValue(
              "name"
            )}`}
            alt="product-image"
          />
          <p className="">{row.getValue("name")}</p>
        </div>
      );
    },
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
];

// Sample data for products
const data: Product[] = [
  {
    id: "1",
    name: "Product A",
    category: "Electronics",
    price: "$199.99",
    stock: 120,
  },
  {
    id: "3",
    name: "Product B",
    category: "Furniture",
    price: "$299.99",
    stock: 85,
  },
  {
    id: "3",
    name: "Product C",
    category: "Clothing",
    price: "$49.99",
    stock: 200,
  },
  {
    id: "4",
    name: "Product D",
    category: "Groceries",
    price: "$3.99",
    stock: 500,
  },
  {
    id: "5",
    name: "Product E",
    category: "Books",
    price: "$15.99",
    stock: 150,
  },
  {
    id: "6",
    name: "Product F",
    category: "Toys",
    price: "$24.99",
    stock: 300,
  },
  {
    id: "7",
    name: "Product G",
    category: "Beauty",
    price: "$14.99",
    stock: 75,
  },
];

// Main component for ProductsPage
export default function ProductsPage() {
  const [userSearch, setUserSearch] = useState("");

  // query
  const {
    data: products,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await axiosInstance.get("/product");
      return res.data;
    },
  });

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-full self-center mx-auto">
        <Spinner size="md" />
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-full self-center mx-auto">
        Error loading users
      </div>
    );

  // Search
  const filteredData = products?.filter(
    (products: Product) =>
      products?.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      products?.category.toLowerCase().includes(userSearch.toLowerCase()) ||
      products?.price.toLowerCase().includes(userSearch.toLowerCase())
  );

  const handleDelete = (productId: string) => {
    console.log("Delete user with ID:", productId);
  };

  return (
    <div className="flex flex-col p-10 gap-5 w-full">
      <PageTitle title="Products" />
      <Options
        haveSearch={true}
        searchValue={userSearch}
        setSearchValue={setUserSearch}
        buttons={[
          <Link to={"/new-product"}>
            <Button variant={"outline"} className="">
              Add Product
            </Button>
          </Link>,
        ]}
      />
      <DataTable
        editLink="/edit-product"
        handleDelete={handleDelete}
        columns={columns}
        data={filteredData}
      />
    </div>
  );
}
