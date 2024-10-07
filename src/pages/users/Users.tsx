import { DataTable } from "@/components/DataTable";
import Options from "@/components/Options";
import PageTitle from "@/components/PageTitle";
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

// Handle the deletion of a user
const handleDelete = (userId: string) => {
  console.log("Delete user with ID:", userId);
  // Add delete logic here (e.g., make an API request)
};

export default function UsersPage() {
  const [userSearch, setUserSearch] = useState("");

  // Fetch users with react-query
  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axiosInstance.get("/users");
      return res.data; // Assume the API returns an array of Payment-type users
    },
  });

  // Handle loading and error states
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading users</div>;

  // Filter users based on the search input
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
