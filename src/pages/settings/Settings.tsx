import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axiosInstance from "@/utils/AxiosInstance";
import { useToast } from "@/hooks/use-toast";

const userProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
});

type UserProfileFormData = z.infer<typeof userProfileSchema>;

export default function Settings() {
  const { toast } = useToast();
  const [editMode, setEditMode] = useState(false);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | undefined>(undefined);
  const queryClient = useQueryClient();

  const userId = localStorage.getItem("userId");

  const { data: profileData, isLoading } = useQuery({
    queryKey: ["userProfile", userId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/users/${userId}`);
      return response.data;
    },
    enabled: !!userId,
  });

  const { control, handleSubmit, reset } = useForm<UserProfileFormData>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
    },
  });

  useEffect(() => {
    if (profileData) {
      reset({
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone,
        password: "", // Reset password field
      });
      setImagePreview(profileData?.image);
    }
  }, [profileData, reset]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: UserProfileFormData & { image?: string }) => {
      return axiosInstance.put(`/users/${userId}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey:["userProfile", userId]});
      setEditMode(false);
      toast({
        title: "Profile updated successfully",
        description: "Your profile information has been updated.",
      });
    },
  });

  const onSubmit = async (data: UserProfileFormData) => {
    let imageBase64: string | undefined;

    if (newImage) {
      imageBase64 = await convertToBase64(newImage);
    }

    updateProfileMutation.mutate({
      ...data,
      image: imageBase64,
    });
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    reset();
    setNewImage(null);
    setImagePreview(profileData?.image ? profileData.image : undefined);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">      
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="size-24">
                <AvatarImage
                  src={imagePreview}
                  alt="user-image"
                />
                <AvatarFallback>{profileData?.name?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              {editMode && (
                <Input type="file" onChange={handleImageChange} accept="image/*" />
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input {...field} disabled={!editMode} />
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input {...field} disabled={!editMode} />
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <Input {...field} disabled={!editMode} />
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <Input 
                    {...field} 
                    type="password" 
                    disabled={!editMode} 
                    placeholder={editMode ? "Enter new password" : "••••••••"}
                  />
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input id="role" value={profileData?.role} disabled />
            </div>

            {editMode ? (
              <div className="space-x-2">
                <Button type="submit">Save Changes</Button>
                <Button type="button" variant="outline" onClick={handleCancelEdit}>Cancel</Button>
              </div>
            ) : (
              <Button type="button" onClick={() => setEditMode(true)}>Edit Profile</Button>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
