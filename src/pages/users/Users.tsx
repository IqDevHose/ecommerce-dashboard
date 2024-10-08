import { DataTable } from "@/components/DataTable";
import Options from "@/components/Options";
import PageTitle from "@/components/PageTitle";
import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/utils/AxiosInstance";
import { useQuery, useQueryClient } from "@tanstack/react-query"; // Import useQueryClient
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { Link } from "react-router-dom";
import ConfirmationModal from "@/components/ConfirmationModal"; // Import the ConfirmationModal

type Payment = {
  id: string;
  name: string;
  email: string;
  lastOrder: string;
  method: string;
};

export default function UsersPage() {
  const [userSearch, setUserSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // Initialize query client
  const queryClient = useQueryClient();

  // Query to fetch users
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

  // Function to handle deletion
  const handleDelete = async (id: string) => {
    try {
      await axiosInstance.delete(`/users/${id}`);
      setModalOpen(false); // Close modal after deletion
      setSelectedUserId(null); // Clear selected user ID
      queryClient.invalidateQueries(["users"]); // Refetch users to update the list
    } catch (err) {
      console.error("Failed to delete user:", err);
    }
  };

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

  // Filter users based on search input
  const filteredData = users?.filter(
    (user: Payment) =>
      user?.name?.includes(userSearch) ||
      user?.email?.includes(userSearch) ||
      user?.method?.includes(userSearch)
  );

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
        const id = row.original.id; // Access the user's ID

        return (
          <div className="flex gap-2">
            {/* Link to Edit user */}
            <Link to={`/edit-user/${id}`}>
              <Button variant="outline" size="sm">
                Edit
              </Button>
            </Link>
            {/* Button to Delete user */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedUserId(id); // Set selected user ID for deletion
                setModalOpen(true); // Open confirmation modal
              }}
            >
              Delete
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col overflow-hidden p-10 gap-5 w-full">
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
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={() => {
          if (selectedUserId) {
            handleDelete(selectedUserId); // Call delete function with the selected user ID
          }
        }}
        message={`Are you sure you want to delete user with ID ${selectedUserId}?`}
      />
    </div>
  );
}
