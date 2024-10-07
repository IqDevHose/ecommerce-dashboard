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

type Payment = {
  id: string;
  name: string;
  email: string;
  lastOrder: string;
  method: string;
};

// Define the columns for the table
const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const name = row.getValue("name");
      return (
        <div className="flex gap-2 items-center">
          <img
            className="h-10 w-10"
            src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${name}`}
            alt="user-image"
          />
          <p>{row.getValue("name")}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "lastOrder",
    header: "Last Order",
  },
  {
    accessorKey: "method",
    header: "Method",
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const userId = row.original.id; // Access the user's ID
      return (
        <div className="flex gap-2">
          {/* Link to Edit user */}
          <Link to={`/edit-user/${userId}`}>
            <Button variant="outline" size="sm">
              Edit
            </Button>
          </Link>
          {/* Button to Delete user */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDelete(userId)} // Attach delete handler
          >
            Delete
          </Button>
        </div>
      );
    },
  },
];

const handleDelete = (userId: string) => {
  console.log("Delete user with ID:", userId);
};

export default function UsersPage() {
  const [userSearch, setUserSearch] = useState("");

  // query
  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axiosInstance.get("/users");
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
  const filteredData = users?.filter(
    (user: Payment) =>
      user?.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      user?.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      user?.method.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="flex flex-col p-10 gap-5 w-full">
      <PageTitle title="Users" />
      <Options
        haveSearch={true}
        searchValue={userSearch}
        setSearchValue={setUserSearch}
        buttons={[
          <Link to="/new-user" key="add-user">
            <Button variant="outline">Add User</Button>
          </Link>,
        ]}
      />
      {/* Pass the filtered data to the DataTable */}
      <DataTable
        columns={columns}
        data={filteredData}
        editLink={"/edit-user"} // Provide the base link for editing users
        handleDelete={handleDelete} // Provide the delete handler function
      />
    </div>
  );
}
