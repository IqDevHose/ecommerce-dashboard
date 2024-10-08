import React, { useEffect, useState } from "react";
import PageTitle from "@/components/PageTitle";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "@/utils/AxiosInstance";
import Spinner from "@/components/Spinner";
import { useQuery, useMutation } from "@tanstack/react-query";

const EditUser = () => {
  const { id } = useParams<{ id: string }>(); // Get the userId from the URL params
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Fetch the user data based on userId
  const { data: user } = useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/users/${id}`);
      return res.data;
    },
    enabled: !!id, // Only run this query if userId exists
  });

  useEffect(() => {
    if  (user) {
      setName(user.name);
      setEmail(user.email);
      setPassword(user.password); 
    }
  }, [user]);

  // Mutation to update user
  const mutation = useMutation({
    mutationFn: async () => {
      const updatedUser = { name, email, password }; // Include password if you want to allow password change
      await axiosInstance.put(`/users/${id}`, updatedUser);
    },
    onSuccess: () => {
        navigate("/users"); // Navigate back to users list after successful update
    },
    onError: (err: any) => {
        setError(
            err?.response?.data?.message || err.message || "Failed to update user"
        );
        console.log(mutation);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous error
    mutation.mutate({ email: email, name: name, password: password }); // Trigger the mutation
  };

  

  return (
    <div className="p-10 flex flex-col gap-5 w-full">
      <PageTitle title="Edit User" />

      {error && <div className="text-red-500">{error}</div>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 rounded"
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 rounded"
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="password">
            New Password (leave blank if not changing)
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 rounded"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="confirm">Confirm New Password</label>
          <input
            id="confirm"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="border p-2 rounded"
          />
        </div>

        <div className="flex justify-between items-center">
          <Button type="submit" variant="outline" disabled={mutation.isPending}>
            {mutation.isPending ? <Spinner size="sm" /> : "Update User"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditUser;
