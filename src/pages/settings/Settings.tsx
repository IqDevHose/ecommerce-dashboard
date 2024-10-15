import { useEffect, useState } from "react";
import PageTitle from "@/components/PageTitle";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type UserProfile = {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string;
  image: string | null; // base64 string
};

export default function Settings() {
  const [profileData, setProfileData] = useState<UserProfile>({
    id: "",
    name: "",
    email: "",
    role: "",
    phone: "",
    image: null,
  });
  const [editMode, setEditMode] = useState(false);
  const [newImage, setNewImage] = useState<File | null>(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await axios.get(`/api/users/${userId}`);
      const userData = response.data;
      
      // Convert image buffer to base64 string if it exists
      if (userData.image) {
        userData.image = `data:image/jpeg;base64,${Buffer.from(userData.image).toString('base64')}`;
      }
      
      setProfileData(userData);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewImage(e.target.files[0]);
      
      // Preview the new image
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target) {
          setProfileData((prevData) => ({ ...prevData, image: event.target?.result as string }));
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      Object.entries(profileData).forEach(([key, value]) => {
        if (key !== 'image' && value !== null) {
          formData.append(key, value);
        }
      });
      if (newImage) {
        formData.append("image", newImage);
      }

      await axios.put(`/api/users/${profileData.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setEditMode(false);
      fetchUserData(); // Refresh data after update
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <PageTitle title="User Settings" />
      
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar className="w-24 h-24">
              <AvatarImage src={profileData.image || undefined} alt={profileData.name} />
              <AvatarFallback>{profileData.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            {editMode && (
              <Input type="file" onChange={handleImageChange} accept="image/*" />
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={profileData.name}
              onChange={handleInputChange}
              disabled={!editMode}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              value={profileData.email}
              onChange={handleInputChange}
              disabled={!editMode}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              value={profileData.phone}
              onChange={handleInputChange}
              disabled={!editMode}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Input id="role" value={profileData.role} disabled />
          </div>

          {editMode ? (
            <Button onClick={handleSave}>Save Changes</Button>
          ) : (
            <Button onClick={() => setEditMode(true)}>Edit Profile</Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
