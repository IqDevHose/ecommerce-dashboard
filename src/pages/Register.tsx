// src/pages/register/RegisterPage.tsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/utils/AxiosInstance";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/Spinner";

export default function RegisterPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // API call to register a new user
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });

      // Save token to localStorage
      localStorage.setItem("token", response.data.access_token);
      navigate("/"); // Redirect to home page after registration
    } catch (err) {
      console.error("Registration failed:", err);
      setError("Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <h2 className="text-center text-2xl font-bold">Sign Up</h2>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <form className="space-y-6" onSubmit={handleRegister}>
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
              disabled={isLoading}
            >
              {isLoading ? <Spinner size="sm" /> : "Sign Up"}
            </Button>
          </div>
        </form>

        <div className="text-sm text-center">
          <p>
            Already have an account?{" "}
            <a href="/login" className="text-indigo-600">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
