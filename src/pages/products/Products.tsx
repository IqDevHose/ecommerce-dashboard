import { DataTable } from "@/components/DataTable";
import PageTitle from "@/components/PageTitle";
import { ColumnDef } from "@tanstack/react-table"; // Ensure you're using @tanstack/react-table in your project

// Define the Product type
type Product = {
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
            src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${row.getValue("name")}`}
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
    name: "Product A",
    category: "Electronics",
    price: "$199.99",
    stock: 120,
  },
  {
    name: "Product B",
    category: "Furniture",
    price: "$299.99",
    stock: 85,
  },
  {
    name: "Product C",
    category: "Clothing",
    price: "$49.99",
    stock: 200,
  },
  {
    name: "Product D",
    category: "Groceries",
    price: "$3.99",
    stock: 500,
  },
  {
    name: "Product E",
    category: "Books",
    price: "$15.99",
    stock: 150,
  },
  {
    name: "Product F",
    category: "Toys",
    price: "$24.99",
    stock: 300,
  },
  {
    name: "Product G",
    category: "Beauty",
    price: "$14.99",
    stock: 75,
  },
  {
    name: "Product H",
    category: "Sports",
    price: "$89.99",
    stock: 60,
  },
  {
    name: "Product I",
    category: "Automotive",
    price: "$199.99",
    stock: 45,
  },
  {
    name: "Product J",
    category: "Garden",
    price: "$39.99",
    stock: 100,
  },
];

// Main component for ProductsPage
export default function ProductsPage() {
  const handleDelete = (id: any) => {
    console.log("delete: ", id);
  }
  return (
    <div className="flex flex-col p-10 gap-5 w-full">
      <PageTitle title="Products" />
      <DataTable columns={columns} data={data} editLink="/edit-product" handleDelete={handleDelete}/>
    </div>
  );
}
