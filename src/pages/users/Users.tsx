import { useState } from "react";
import { DataTable } from "@/components/DataTable";
import Options from "@/components/Options";
import PageTitle from "@/components/PageTitle";
import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/utils/AxiosInstance";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import ConfirmationModal from "@/components/ConfirmationModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PencilIcon, PlusIcon, TrashIcon, UserIcon } from "lucide-react";

type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  image: string; // This will be a base64 string
  role: string;
};

export default function UsersPage() {
  const [userSearch, setUserSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{ id: string; name: string } | null>(null);

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

  const currentUserId = localStorage.getItem("userId"); // Assume this hook gives us the current user's info

  // Function to handle deletion
  const handleDelete = async (id: string) => {
    try {
      await axiosInstance.delete(`/users/${id}`);
      setModalOpen(false); // Close modal after deletion
      setSelectedUser(null); // Clear selected user
      queryClient.invalidateQueries({ queryKey: ["users"] }); // Refetch users to update the list
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
    (user: User) =>
      user?.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
      user?.email?.toLowerCase().includes(userSearch.toLowerCase()) ||
      user?.phone?.includes(userSearch)
  );

  // Define the columns for the table
  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "image",
      header: "Image",
      cell: ({ row }) => {
        const imageData = row.getValue("image") as string;
        return (
          <div className="relative">
            <Avatar>
              <AvatarImage
                src={imageData}
                alt="user-image"
              />
              <AvatarFallback>{(row.getValue("name") as string)?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            
          </div>
        );
      },
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const isCurrentUser = row.original.id === currentUserId;
        return (
          <div className="flex items-center gap-1">
            <span>{row.getValue("name")}</span>
            {isCurrentUser && (
              <Badge variant="outline">
                Me
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "phone",
      header: "Phone",
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const role = row.getValue("role") as string;
        return (
          <Badge variant={role === "ADMIN" ? "blue" : "default"}>
            {role}
          </Badge>
        );
      },
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const id = row.original.id; // Access the user's ID
        const name = row.getValue("name") as string; // Access the user's name

        return (
          <div className="flex gap-2">
            {/* Link to Edit user */}
            <Link to={`/edit-user/${id}`}>
              <Button variant="ghost" size="icon" className="text-blue-500 hover:text-blue-600">
                <PencilIcon className="h-4 w-4" />
              </Button>
            </Link>
            {/* Button to Delete user */}
            <Button
              variant="ghost"
              size="icon"
              className="text-red-500 hover:text-red-600"
              onClick={() => {
                setSelectedUser({ id, name }); // Set selected user for deletion
                setModalOpen(true); // Open confirmation modal
              }}
            >
              <TrashIcon className="h-4 w-4" />
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
            {/* add plus icon */}
            
            <Button variant="default" className="flex items-center gap-1">
              <PlusIcon className="w-4 h-4" />
              <span>Add User</span>
            </Button>
          </Link>,
        ]}
      />
      {/* Pass the filtered data to the DataTable */}
      <DataTable
        columns={columns}
        data={filteredData}
        editLink={"/edit-user"} // Provide the base link for editing users
        handleDelete={function (id: string): void {
          throw new Error("Function not implemented.");
        } }      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={() => {
          if (selectedUser) {
            handleDelete(selectedUser.id); // Call delete function with the selected user ID
          }
        }}
        message={`Are you sure you want to delete user with name "${selectedUser?.name}"?`} // Updated message to use user's name
      />
    </div>
  );
}
