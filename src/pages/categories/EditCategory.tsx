import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import PageTitle from "@/components/PageTitle";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "@/utils/AxiosInstance";
import Spinner from "@/components/Spinner";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
});

type FormData = z.infer<typeof schema>;

const EditCategory = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { control, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const { data: category } = useQuery({
    queryKey: ["category", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/category/${id}`);
      return res.data;
    },
    enabled: !!id,
    onSuccess: (data) => {
      reset({ name: data.name });
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      return await axiosInstance.put(`/category/${id}`, data);
    },
    onSuccess: () => {
      navigate("/categories");
    },
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };

  return (
    <div className="p-10 flex flex-col gap-5 w-full">
      <PageTitle title="Edit Category" />
      {mutation.error && <div className="text-red-500">{(mutation.error as Error).message}</div>}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label htmlFor="name">Category Name</label>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input {...field} id="name" type="text" disabled={mutation.isPending} className={`${errors.name ? 'border-red-500' : ''}`} />
            )}
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>

        <div className="flex justify-between items-center">
          <Button type="submit" variant="default" disabled={mutation.isPending}>
            {mutation.isPending ? <Spinner size="sm" /> : "Update Category"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditCategory;
