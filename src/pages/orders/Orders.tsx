import { DataTable } from "@/components/DataTable";
import Options from "@/components/Options";
import PageTitle from "@/components/PageTitle";
import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import axiosInstance from "@/utils/AxiosInstance";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { Link } from "react-router-dom";

type Payment = {
  id: string;
  order: string;
  status: string;
  lastOrder: string;
  method: string;
};

const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "order",
    header: "Order",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return (
        <div
          className={cn("font-medium w-fit px-4 py-2 rounded-lg", {
            "bg-red-200": row.getValue("status") === "Pending",
            "bg-orange-200": row.getValue("status") === "Processing",
            "bg-green-200": row.getValue("status") === "Completed",
          })}
        >
          {row.getValue("status")}
        </div>
      );
    },
  },
  {
    accessorKey: "lastOrder",
    header: "Last Order",
  },
  {
    accessorKey: "method",
    header: "Method",
  },
];

const data: Payment[] = [
  {
    id: "1",
    order: "ORD001",
    status: "Pending",
    lastOrder: "2023-01-15",
    method: "Credit Card",
  },
  {
    id: "2",
    order: "ORD002",
    status: "Processing",
    lastOrder: "2023-02-20",
    method: "PayPal",
  },
  {
    id: "3",
    order: "ORD003",
    status: "Completed",
    lastOrder: "2023-03-10",
    method: "Stripe",
  },
  {
    id: "4",
    order: "ORD004",
    status: "Pending",
    lastOrder: "2023-04-05",
    method: "Venmo",
  },
  {
    id: "5",
    order: "ORD005",
    status: "Completed",
    lastOrder: "2023-05-12",
    method: "Bank Transfer",
  },
  {
    id: "6",
    order: "ORD006",
    status: "Processing",
    lastOrder: "2023-06-18",
    method: "Apple Pay",
  },
  {
    id: "7",
    order: "ORD007",
    status: "Completed",
    lastOrder: "2023-07-22",
    method: "Google Pay",
  },
  {
    id: "8",
    order: "ORD008",
    status: "Pending",
    lastOrder: "2023-08-30",
    method: "Cryptocurrency",
  },
  {
    id: "9",
    order: "ORD009",
    status: "Processing",
    lastOrder: "2023-09-05",
    method: "Alipay",
  },
];

export default function Orders() {
  const [userSearch, setUserSearch] = useState("");

  // query
  const {
    data: order,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["order"],
    queryFn: async () => {
      const res = await axiosInstance.get("/order");
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
  const filteredData = order?.filter(
    (order: Payment) =>
      order?.order.toLowerCase().includes(userSearch.toLowerCase()) ||
      order?.status.toLowerCase().includes(userSearch.toLowerCase()) ||
      order?.method.toLowerCase().includes(userSearch.toLowerCase())
  );

  const handleDelete = (orderId: string) => {
    console.log("Delete user with ID:", orderId);
  };

  return (
    <div className="flex flex-col p-10 gap-5 w-full">
      <PageTitle title="Orders" />
      <Options
        haveSearch={true}
        searchValue={userSearch}
        setSearchValue={setUserSearch}
        buttons={[
          <Link to={"/new-order"}>
            <Button variant={"outline"} className="">
              Add Order
            </Button>
          </Link>,
        ]}
      />
      <DataTable
        editLink="/edit-order"
        handleDelete={handleDelete}
        columns={columns}
        data={filteredData}
      />
    </div>
  );
}
