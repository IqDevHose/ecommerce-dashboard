import { useState } from "react";
import { DataTable } from "@/components/DataTable";
import Options from "@/components/Options";
import PageTitle from "@/components/PageTitle";
import Spinner from "@/components/Spinner";
import axiosInstance from "@/utils/AxiosInstance";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Order = {
  id: string;
  userId: string;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  total: number;
  status: "PENDING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  createdAt: string;
  updatedAt: string;
  orderItems: {
    id: string;
    productId: string;
    quantity: number;
    price: number;
    product: {
      name: string;
    };
  }[];
};

export default function OrdersPage() {
  const [orderSearch, setOrderSearch] = useState("");

  // Query to fetch orders
  const {
    data: orders,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await axiosInstance.get("/order");
      return res.data;
    },
  });

  const queryClient = useQueryClient();

  // Mutation to update order status
  const updateOrderStatus = useMutation({
    mutationFn: async ({ orderId, newStatus }: { orderId: string; newStatus: Order['status'] }) => {
      const response = await axiosInstance.put(`/order/${orderId}`, { status: newStatus });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
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
        Error loading orders
      </div>
    );

  // Filter orders based on search input
  const filteredData = orders?.filter(
    (order: Order) =>
      order?.name?.toLowerCase().includes(orderSearch.toLowerCase()) ||
      order?.email?.toLowerCase().includes(orderSearch.toLowerCase()) ||
      order?.phoneNumber?.includes(orderSearch)
  );

  // Define the columns for the table
  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: "name",
      header: "Customer Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "phoneNumber",
      header: "Phone",
    },
    {
      accessorKey: "total",
      header: "Total",
      cell: ({ row }) => {
        return <span>${row.getValue("total")}</span>;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as Order["status"];
        const orderId = row.original.id;

        return (
          <Select
            defaultValue={status}
            onValueChange={(newStatus) => {
              updateOrderStatus.mutate({ orderId, newStatus: newStatus as Order['status'] });
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue>
                <Badge
                  variant={
                    status === "PENDING"
                      ? "warning"
                      : status === "SHIPPED"
                      ? "default"
                      : status === "DELIVERED"
                      ? "success"
                      : "destructive"
                  }
                >
                  {status}
                </Badge>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PENDING">PENDING</SelectItem>
              <SelectItem value="SHIPPED">SHIPPED</SelectItem>
              <SelectItem value="DELIVERED">DELIVERED</SelectItem>
              <SelectItem value="CANCELLED">CANCELLED</SelectItem>
            </SelectContent>
          </Select>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Order Date",
      cell: ({ row }) => {
        return new Date(row.getValue("createdAt")).toLocaleDateString();
      },
    },
    {
      accessorKey: "orderItems",
      header: "Items",
      cell: ({ row }) => {
        const orderItems = row.original.orderItems;
        return (
          <div>
            {orderItems.map((item, index) => (
              <div key={item.id}>
                {item.product.name} (x{item.quantity})
                {index < orderItems.length - 1 && ", "}
              </div>
            ))}
          </div>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col overflow-hidden p-10 gap-5 w-full">
      <PageTitle title="Orders" />
      <Options
        haveSearch={true}
        searchValue={orderSearch}
        // add pading to the search
        setSearchValue={setOrderSearch}
        buttons={[]} // Add this line
      />
      {/* Pass the filtered data to the DataTable */}
      <DataTable
        columns={columns}
        data={filteredData}
        handleDelete={function (id: string): void {
          throw new Error("Function not implemented.");
        }}
        editLink="/orders/edit" // Add this line
      />
    </div>
  );
}
