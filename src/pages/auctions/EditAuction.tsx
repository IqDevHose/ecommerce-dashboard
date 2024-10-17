import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import PageTitle from "@/components/PageTitle";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "@/utils/AxiosInstance";
import Spinner from "@/components/Spinner";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

const schema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  startPrice: z.coerce.number().positive("Start price must be positive"),
  endPrice: z.coerce.number().positive("End price must be positive"),
  endTime: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/, "Invalid ISO date format"),
});

type FormData = z.infer<typeof schema>;

const EditAuction = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { control, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await axiosInstance.get("/product");
      return res.data;
    },
  });

  const { data: auction, isLoading: auctionLoading } = useQuery({
    queryKey: ["auction", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/auction/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (auction) {
      reset({
        productId: auction.productId,
        startPrice: auction.startPrice,
        endPrice: auction.endPrice,
        endTime: new Date(auction.endTime).toISOString(),
      });
    }
  }, [auction, reset]);

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      return await axiosInstance.put(`/auction/${id}`, data);
    },
    onSuccess: () => {
      navigate("/auctions");
    },
  });

  const onSubmit = (data: FormData) => {
    const submissionData = {
      ...data,
      startPrice: Number(data.startPrice),
      endPrice: Number(data.endPrice),
      endTime: new Date(data.endTime).toISOString(), // Convert Date to ISO string
    };
    mutation.mutate(submissionData);
  };

  if (auctionLoading) {
    return <Spinner size="lg" />;
  }

  return (
    <div className="p-10 flex flex-col gap-5 w-full">
      <PageTitle title="Edit Auction" />
      {mutation.error && <div className="text-red-500">{(mutation.error as Error).message}</div>}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label htmlFor="productId">Product</label>
          <Controller
            name="productId"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  {productsLoading ? (
                    <SelectItem value="loading">Loading products...</SelectItem>
                  ) : (
                    products?.map((product: any) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            )}
          />
          {errors.productId && <p className="text-red-500">{errors.productId.message}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="startPrice">Start Price</label>
          <Controller
            name="startPrice"
            control={control}
            render={({ field }) => (
              <Input {...field} id="startPrice" type="number" disabled={mutation.isPending} className={`${errors.startPrice ? 'border-red-500' : ''}`} />
            )}
          />
          {errors.startPrice && <p className="text-red-500">{errors.startPrice.message}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="endPrice">End Price</label>
          <Controller
            name="endPrice"
            control={control}
            render={({ field }) => (
              <Input {...field} id="endPrice" type="number" disabled={mutation.isPending} className={`${errors.endPrice ? 'border-red-500' : ''}`} />
            )}
          />
          {errors.endPrice && <p className="text-red-500">{errors.endPrice.message}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="endTime">End Time</label>
          <Controller
            name="endTime"
            control={control}
            render={({ field }) => (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={`w-full justify-start text-left font-normal ${!field.value && "text-muted-foreground"}`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={(date) => field.onChange(date?.toISOString())}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            )}
          />
          {errors.endTime && <p className="text-red-500">{errors.endTime.message}</p>}
        </div>

        <div className="flex justify-between items-center">
          <Button type="submit" variant="default" disabled={mutation.isPending}>
            {mutation.isPending ? <Spinner size="sm" /> : "Update Auction"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditAuction;
