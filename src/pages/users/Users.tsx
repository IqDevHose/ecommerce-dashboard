import { DataTable } from "@/components/DataTable";
import Options from "@/components/Options";
import PageTitle from "@/components/PageTitle";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table"; // Ensure you're using @tanstack/react-table in your project
import { useState } from "react";
import { Link } from "react-router-dom";

type Payment = {
  id: string; // Add the id field
  name: string;
  email: string;
  lastOrder: string;
  method: string;
};

const data: Payment[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    lastOrder: "2023-01-01",
    method: "Credit Card",
  },
  {
    id: "2",
    name: "Alice Smith",
    email: "alice@example.com",
    lastOrder: "2023-02-15",
    method: "PayPal",
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    lastOrder: "2023-03-20",
    method: "Stripe",
  },
  // Add id for other users
  {
    id: "4",
    name: "Emma Brown",
    email: "emma@example.com",
    lastOrder: "2023-04-10",
    method: "Venmo",
  },
  {
    id: "5",
    name: "Michael Davis",
    email: "michael@example.com",
    lastOrder: "2023-05-05",
    method: "Cash",
  },
  // Add ids for the rest of the users...
];

const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return (
        <div className="flex gap-2 items-center">
          <img
            className="h-10 w-10"
            src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${row.getValue(
              "name"
            )}`}
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
];


export default function UsersPage() {
  const [userSearch, setUserSearch] = useState("");

  const handleDelete = (userId: string) => {
    console.log("Delete user with ID:", userId);
  };

  return (
    <div className="flex flex-col p-10 gap-5 w-full">
      <PageTitle title="Users" />
      <Options
        haveSearch={true}
        searchValue={userSearch}
        setSearchValue={setUserSearch}
        buttons={[
          <Link to={"/new-user"}>
            <Button variant={"outline"} className="">
              Add User
            </Button>
          </Link>,
        ]}
      />
      <DataTable
        columns={columns}
        data={data}
        editLink={"/edit-user"} // Provide the base link for editing users
        handleDelete={handleDelete} // Provide the delete handler function
      />
    </div>
  );
}