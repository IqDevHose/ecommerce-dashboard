import axiosInstance from "@/utils/AxiosInstance";
import { OrderT, StatusT, UserT } from "@/utils/type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import { Badge } from "@/components/ui/badge";

const Orders = () => {
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const queryClient = useQueryClient();

  const UpdateOrderStatusParams: StatusT[] = [
    "PENDING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
  ];

  // Fetch users with useQuery
  const { data: users = [], isLoading: usersLoading } = useQuery<UserT[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await axiosInstance.get("users");
      return response.data;
    },
  });

  // Fetch orders with useQuery
  const { data: orders = [], isLoading: ordersLoading } = useQuery<OrderT[]>({
    queryKey: ["orders"],
    queryFn: async () => {
      const response = await axiosInstance.get("order");
      return response.data;
    },
  });

  // Filter orders based on selected user and status
  const filteredOrders = orders.filter((order) => {
    const userMatch = selectedUser ? order.userId === selectedUser : true;
    const statusMatch = selectedStatus ? order.status === selectedStatus : true;
    return userMatch && statusMatch;
  });

  // Mutation to update the order status
  const mutation = useMutation({
    mutationFn: async ({
      orderId,
      newStatus,
    }: {
      orderId: string;
      newStatus: StatusT;
    }) => {
      await axiosInstance.put(`order/${orderId}`, { status: newStatus });
    },
    onSuccess: () => {
      // Invalidate and refetch orders after updating the status
      queryClient.invalidateQueries(["orders"]);
    },
    onError: (error) => {
      // Handle error here (e.g., show a notification)
      console.error("Error updating order status:", error);
    },
  });

  // Function to handle order status change
  const updateOrderStatus = (orderId: string, newStatus: StatusT) => {
    mutation.mutate({ orderId, newStatus });
  };

  if (usersLoading || ordersLoading) return <p>Loading...</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Orders</h1>
      <div className="flex flex-row gap-4">
        <div className="mb-4">
          <select
            id="userSelect"
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="p-2 border border-gray-300 rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Users</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <select
            id="statusSelect"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="p-2 border border-gray-300 rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            {UpdateOrderStatusParams.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border-b border-gray-300 p-4 text-left">User Name</th>
              <th className="border-b border-gray-300 p-4 text-left">Order Items</th>
              <th className="border-b border-gray-300 p-4 text-left">Current Status</th>
              <th className="border-b border-gray-300 p-4 text-left">Created At</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition">
                <td className="border-b border-gray-300 p-4">
                  {users.find((user) => user.id === order.userId)?.name}
                </td>
                <td className="border-b border-gray-300 p-4">
                  {order.orderItems.map((item) => (
                    <div key={item.id}>{item.name}</div>
                  ))}
                </td>
                <td className="border-b border-gray-300 p-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="p-2   rounded-md cursor-pointer">
                      <Badge
                        variant={
                          order.status === "PENDING"
                            ? "default"
                            : order.status === "CANCELLED"
                            ? "destructive"
                            : order.status === "DELIVERED"
                            ? "outline"
                            : order.status === "SHIPPED"
                            ? "primary" // Assuming you have a "primary" variant for shipped
                            : "default" // Fallback variant
                        }
                      >
                        {order.status}
                      </Badge>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-white  rounded-md shadow-lg">
                      {UpdateOrderStatusParams.map((status) => (
                        <DropdownMenuItem
                          key={status}
                          onClick={() =>
                            updateOrderStatus(order.id, status as StatusT)
                          }
                          className="cursor-pointer px-2 py-1 hover:bg-gray-200"
                        >
                          {status}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
                <td className="border-b p-4">{order.createdAt}</td>
              </tr>
            ))}
            {filteredOrders.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="border-b border-gray-300 p-4 text-center"
                >
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
