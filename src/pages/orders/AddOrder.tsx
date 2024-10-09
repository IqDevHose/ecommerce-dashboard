// AddOrder.tsx
import { useState } from "react";
import axiosInstance from "@/utils/AxiosInstance"; // Adjust the import based on your project structure
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button"; // Adjust the import based on your UI components
import { Input } from "@/components/ui/input"; // Import the correct named export from the Input component
import { useMutation } from "@tanstack/react-query";

export enum OrderStatus {

  PENDING="PENDING",
  SHIPPED="SHIPPED",
  DELIVERED="DELIVERED",
  CANCELLED="CANCELLED",
 
}

const AddOrder = () => {
  const [userId, setUserId] = useState<any | "">("");
  const [total, setTotal] = useState<number | "">("");
  const [status, setStatus] = useState<OrderStatus | "">("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  // Set up the mutation
  const mutation = useMutation({
    mutationFn: async (newOrder: {
      userId: any;
      total: number;
      status: OrderStatus;
    }) => {
      return await axiosInstance.post("/order", newOrder); // Adjust the endpoint as needed
    },
    onSuccess: () => {
      // Reset form fields on success
      setUserId("");
      setTotal("");
      setStatus("");
      navigate("/order"); // Navigate to orders page after successful addition
    },
    onError: (err: any) => {
      setError(
        err?.response?.data?.message || err.message || "Failed to add order"
      );
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    // Validate fields
    if (userId === "" || total === "" || status === "") {
      setError("All fields are required.");
      return;
    }

    // Call the mutation with the order data
    mutation.mutate({
      userId: String(userId),
      total: Number(total),
      status: status as OrderStatus,
    });
  };

  return (
    <div className="flex flex-col items-center p-10">
      <h1 className="text-2xl font-bold mb-5">Add New Order</h1>
     
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full max-w-md"
      >
        <Input
          type="text"
          placeholder="User ID"
          value={userId?.toString() || ""}
          onChange={(e) => setUserId(String(e.target.value))}
          required
        />
        <Input
          type="number"
          placeholder="Total"
          value={total || ""}
          onChange={(e) => setTotal(Number(e.target.value))}
          required
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as OrderStatus)}
          className="p-2 border border-gray-300 rounded"
          required
        >
          <option value="" disabled>
            Select Order Status
          </option>
          <option value={OrderStatus.PENDING}>{OrderStatus.PENDING}</option>
          <option value={OrderStatus.CANCELLED}>
            {OrderStatus.CANCELLED}
          </option>
          <option value={OrderStatus.DELIVERED}>{OrderStatus.DELIVERED}</option>
          <option value={OrderStatus.SHIPPED}>{OrderStatus.SHIPPED}</option>

        </select>
        <Button type="submit" disabled={mutation.isPending}>
          Add Order
        </Button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
      {mutation.isPending && <p>Loading...</p>}
    </div>
  );
};

export default AddOrder;
