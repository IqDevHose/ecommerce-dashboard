import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/utils/AxiosInstance";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/Spinner";
import { useMutation } from "@tanstack/react-query";

type LoginData = {
  username: string;
  password: string;
}


export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();


  const mutation = useMutation({
    mutationFn: async (data:LoginData) => {
      // API call to log in
      const response = await axiosInstance.post("/auth/login", data);
      return response.data;
    },
    onSuccess: (data) => {
      // Save token to localStorage if login is successful
      console.log(data)
      if(data.user.role === "ADMIN") {
        localStorage.setItem("jwtToken", data.access_token);
        navigate("/"); // Redirect to home page
      }
      else {
        setError("Only admin users can access this page.")
      }

    },
    onError: () => {
      setError("Invalid email or password.");
    },
  });

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    mutation.mutate({
      username: email,
      password,
    })
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <h2 className="text-center text-2xl font-bold">Login</h2>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <form className="space-y-6" onSubmit={handleLogin}>
          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="you@example.com"
            />
          </div>

          {/* Password Input */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="••••••••"
            />
          </div>

          {/* Submit Button */}
          <div>
            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? <Spinner size="sm" /> : "Login"}
            </Button>
          </div>
        </form>

        <div className="text-sm text-center">
          <p>
            Don't have an account?{" "}
            <a href="/register" className="text-indigo-600">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
