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
import { PencilIcon, PlusIcon, TrashIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Auction = {
  id: string;
  productId: string;
  startPrice: number;
  endPrice: number;
  endTime: string;
  image?: string;
};

export default function AuctionsPage() {
  const [auctionSearch, setAuctionSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAuction, setSelectedAuction] = useState<{ id: string; productId: string } | null>(null);

  const queryClient = useQueryClient();

  const {
    data: auctions,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["auctions"],
    queryFn: async () => {
      const res = await axiosInstance.get("/auction");
      return res.data;
    },
  });

  const handleDelete = async (id: string) => {
    try {
      await axiosInstance.delete(`/auction/${id}`);
      setModalOpen(false);
      setSelectedAuction(null);
      queryClient.invalidateQueries({ queryKey: ["auctions"] });
    } catch (err) {
      console.error("Failed to delete auction:", err);
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
        Error loading auctions
      </div>
    );

  const filteredData = auctions?.filter(
    (auction: Auction) =>
      auction?.productId?.toLowerCase().includes(auctionSearch.toLowerCase()) ||
      auction?.startPrice?.toString().includes(auctionSearch) ||
      auction?.endPrice?.toString().includes(auctionSearch)
  );

  const columns: ColumnDef<Auction>[] = [
    {
      accessorKey: "productId",
      header: "Product ID",
      cell: ({ row }) => {
        const productId = row.getValue("productId") as string;
        // show image here
        const { data: product } = useQuery({
          queryKey: ["product", productId],
          queryFn: async () => {
            const res = await axiosInstance.get(`/product/${productId}`);
            return res.data;
          },
        }); 
        if (product) {
          return <Link to={`/products/${productId}`}>
            <Avatar>
              <AvatarImage src={product.image} alt={product.name} />
              <AvatarFallback>{product.name.charAt(0)}</AvatarFallback>
            </Avatar>
          </Link>;
        }
      },
    },
    {
      accessorKey: "startPrice",
      header: "Start Price",
      cell: ({ row }) => `$${row.getValue("startPrice")}`,
    },
    {
      accessorKey: "endPrice",
      header: "End Price",
      cell: ({ row }) => `$${row.getValue("endPrice")}`,
    },
    {
      accessorKey: "endTime",
      header: "End Time",
      cell: ({ row }) => new Date(row.getValue("endTime")).toLocaleString(),
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const id = row.original.id;
        const productId = row.getValue("productId") as string;

        return (
          <div className="flex gap-2">
            <Link to={`/edit-auction/${id}`}>
              <Button variant="ghost" size="icon" className="text-blue-500 hover:text-blue-600">
                <PencilIcon className="h-4 w-4" />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="text-red-500 hover:text-red-600"
              onClick={() => {
                setSelectedAuction({ id, productId });
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
      <PageTitle title="Auctions" />
      <Options
        haveSearch={true}
        searchValue={auctionSearch}
        setSearchValue={setAuctionSearch}
        buttons={[
          <Link to="/new-auction" key="add-auction">
            <Button variant="default" className="flex items-center gap-1">
              <PlusIcon className="w-4 h-4" />
              <span>Add Auction</span>
            </Button>
          </Link>,
        ]}
      />
      <DataTable
        columns={columns}
        data={filteredData}
        editLink={"/edit-auction"}
        handleDelete={handleDelete}
      />

      <ConfirmationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={() => {
          if (selectedAuction) {
            handleDelete(selectedAuction.id);
          }
        }}
        message={`Are you sure you want to delete auction for product "${selectedAuction?.productId}"?`}
      />
    </div>
  );
}
