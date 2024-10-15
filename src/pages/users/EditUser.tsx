import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import PageTitle from "@/components/PageTitle";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "@/utils/AxiosInstance";
import Spinner from "@/components/Spinner";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye, EyeOff } from "lucide-react";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  password: z.string().min(6, "Password must be at least 6 characters").optional().or(z.literal('')),
  confirm: z.string().optional().or(z.literal('')),
  role: z.enum(["ADMIN", "USER"]),
}).refine((data) => data.password === data.confirm, {
  message: "Passwords do not match",
  path: ["confirm"],
});

type FormData = z.infer<typeof schema>;

const EditUser = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { control, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      role: "USER",
    },
  });

  const { data: user } = useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/users/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        role: user.role,
      });
      setImagePreview(user.image ? `data:image/jpeg;base64,${user.image}` : null);
    }
  }, [user, reset]);

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const { confirm, ...dataToSend } = data;
      const formData = new FormData();
      Object.entries(dataToSend).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });
      if (image) formData.append('image', image);
      await axiosInstance.put(`/users/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    },
    onSuccess: () => {
      navigate("/users");
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };

  return (
    <div className="p-10 flex flex-col gap-5 w-full">
      <PageTitle title="Edit User" />
      {mutation.error && <div className="text-red-500">{(mutation.error as Error).message}</div>}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label htmlFor="name">Name</label>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input {...field} id="name" type="text" disabled={mutation.isPending} className={`${errors.name ? 'border-red-500' : ''}`} />
            )}
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="email">Email</label>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input {...field} id="email" type="email" disabled={mutation.isPending} className={`${errors.email ? 'border-red-500' : ''}`} />
            )}
          />
          {errors.email && <p className="text-red-500">{errors.email.message}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="phone">Phone</label>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <Input {...field} id="phone" type="tel" disabled={mutation.isPending} className={`${errors.phone ? 'border-red-500' : ''}`} />
            )}
          />
          {errors.phone && <p className="text-red-500">{errors.phone.message}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="password">New Password (leave blank if not changing)</label>
          <div className="relative">
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  disabled={mutation.isPending}
                  className={`${errors.password ? 'border-red-500' : ''} pr-10`}
                />
              )}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? <EyeOff className="h-4 w-4 text-gray-500" /> : <Eye className="h-4 w-4 text-gray-500" />}
            </button>
          </div>
          {errors.password && <p className="text-red-500">{errors.password.message}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="confirm">Confirm New Password</label>
          <div className="relative">
            <Controller
              name="confirm"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="confirm"
                  type={showConfirmPassword ? "text" : "password"}
                  disabled={mutation.isPending}
                  className={`${errors.confirm ? 'border-red-500' : ''} pr-10`}
                />
              )}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4 text-gray-500" /> : <Eye className="h-4 w-4 text-gray-500" />}
            </button>
          </div>
          {errors.confirm && <p className="text-red-500">{errors.confirm.message}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="role">Role</label>
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value} >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USER">User</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.role && <p className="text-red-500">{errors.role.message}</p>}
        </div>

        <div className="flex flex-col gap-2">
          {imagePreview && (
            <Avatar className="w-24 h-24">
              <AvatarImage src={imagePreview} alt="Preview" />
              <AvatarFallback>Preview</AvatarFallback>
            </Avatar>
          )}
          <label htmlFor="image">Profile Image</label>
          <Input
            id="image"
            type="file"
            onChange={handleImageChange}
            className="border p-2 rounded"
            accept="image/*"
            disabled={mutation.isPending}
          />
        </div>

        <div className="flex justify-between items-center">
          <Button type="submit" variant="default" disabled={mutation.isPending}>
            {mutation.isPending ? <Spinner size="sm" /> : "Update User"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditUser;
