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

type User = {
  id: string;
  name: string; // Assuming you want to include a name field for users
  status: string;
  lastOrder: string;
  method: string;
};

const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "User", // Changed from 'Order' to 'User'
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row, column }) => {
      const status = row.getValue("status");
      return (
        <div
          className={cn("font-medium w-fit px-4 py-2 rounded-lg", {
            "bg-red-200": status === "Pending",
            "bg-orange-200": status === "Processing",
            "bg-green-200": status === "Completed",
          })}
        >
          {/* Dropdown for status selection */}
          <select
            value={status}
            onChange={(e) => {
              // Handle status change here (you may want to call an API to update status)
              console.log("Status updated to:", e.target.value);
            }}
            className="bg-transparent border-none outline-none"
          >
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Completed">Completed</option>
          </select>
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

export default function Users() { // Changed the function name to Users
  const [userSearch, setUserSearch] = useState("");

  // Query for users instead of orders
  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axiosInstance.get("/user"); // Change the endpoint to fetch users
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

  // Search - You can implement search functionality here if needed
  const filteredData = users; // You can add filtering logic based on userSearch

  const handleDelete = (userId: string) => {
    console.log("Delete user with ID:", userId);
  };

  return (
    <div className="flex flex-col overflow-hidden p-10 gap-5 w-full">
      <PageTitle title="Users" /> {/* Changed the title to 'Users' */}
      <Options
        haveSearch={true}
        searchValue={userSearch}
        setSearchValue={setUserSearch}
        buttons={[
          <Link to={"/new-user"}> {/* Changed to new-user route */}
            <Button variant={"outline"} className="">
              Add User
            </Button>
          </Link>,
        ]}
      />
      <DataTable
        editLink="/edit-user" // Changed edit link to users
        handleDelete={handleDelete}
        columns={columns}
        data={filteredData}
      />
    </div>
  );
}
