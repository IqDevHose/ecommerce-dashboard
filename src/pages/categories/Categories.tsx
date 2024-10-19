import React, { useState } from 'react';
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
import { PencilIcon, PlusIcon, TrashIcon } from "lucide-react";

type Category = {
  id: string;
  name: string;
};

export default function CategoriesPage() {
  const [categorySearch, setCategorySearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<{ id: string; name: string } | null>(null);

  const queryClient = useQueryClient();

  const {
    data: categories,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await axiosInstance.get("/category");
      return res.data;
    },
  });

  const handleDelete = async (id: string) => {
    try {
      await axiosInstance.delete(`/category/${id}`);
      setModalOpen(false);
      setSelectedCategory(null);
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    } catch (err) {
      console.error("Failed to delete category:", err);
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
        Error loading categories
      </div>
    );

  const filteredData = categories?.filter((category: Category) =>
    category?.name?.toLowerCase().includes(categorySearch.toLowerCase())
  );

  const columns: ColumnDef<Category>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const id = row.original.id;
        const name = row.getValue("name") as string;

        return (
          <div className="flex gap-2">
            <Link to={`/edit-category/${id}`}>
              <Button variant="ghost" size="icon" className="text-blue-500 hover:text-blue-600">
                <PencilIcon className="h-4 w-4" />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="text-red-500 hover:text-red-600"
              onClick={() => {
                setSelectedCategory({ id, name });
                setModalOpen(true);
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
      <PageTitle title="Categories" />
      <Options
        haveSearch={true}
        searchValue={categorySearch}
        setSearchValue={setCategorySearch}
        buttons={[
          <Link to="/new-category" key="add-category">
            <Button variant="default" className="flex items-center gap-1">
              <PlusIcon className="w-4 h-4" />
              <span>Add Category</span>
            </Button>
          </Link>,
        ]}
      />
      <DataTable
        columns={columns}
        data={filteredData}
        editLink={"/edit-category"}
        handleDelete={handleDelete}
      />

      <ConfirmationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={() => {
          if (selectedCategory) {
            handleDelete(selectedCategory.id);
          }
        }}
        message={`Are you sure you want to delete category "${selectedCategory?.name}"?`}
      />
    </div>
  );
}
