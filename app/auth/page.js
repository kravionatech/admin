"use client";


import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from 'sweetalert2';

export default function AuthPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const baseurl = process.env.NEXT_PUBLIC_API_URL;

  const handleLogin = async () => {
    try {
      const res = await fetch(`${baseurl}/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json", // Crucial for backend JSON parsing
        },
        body: JSON.stringify({ identifier, password })
      });

      // Fetch doesn't throw on 4xx/5xx responses; check manually:
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Login failed with status: ${res.status}`);
      }

      const data = await res.json();
      console.log(data)
      
      // Success alert
      await Swal.fire({
        icon: "success",
        title: "Welcome back!",
        text: "Logged in successfully.",
        timer: 1500,
        showConfirmButton: false
      });

      // Redirect upon successful authentication
      router.push("/dashboard");

    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message || "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-gray-50 font-sans overflow-hidden p-4 sm:p-8">
      {/* Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#235056] rounded-full blur-[150px] opacity-20"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-[#d26c51] rounded-full blur-[150px] opacity-20"></div>
      <div className="absolute top-[20%] right-[20%] w-[300px] h-[300px] bg-[#f2c695] rounded-full blur-[120px] opacity-30"></div>

      <div className="relative z-10 w-full max-w-xl">
        <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-gray-100">
          
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <img
              src="https://kraviona.com/_next/image?url=%2Flogo.png&w=48&q=75"
              alt="Kraviona Logo"
              className="w-16 h-16 mb-4 object-contain"
            />
            <h1 className="text-3xl font-extrabold text-[#235056] uppercase tracking-wider">
              Kraviona
            </h1>
            <p className="text-center text-gray-500 mt-2 text-sm">
              Welcome back! Please enter your details.
            </p>
          </div>

          {/* Login Form */}
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-[#235056] mb-1.5">
                Email / Username
              </label>
              <input
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                type="text"
                placeholder="Enter your email or username"
                name="identifier"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d26c51]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#235056] mb-1.5">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d26c51]"
              />

              <div className="flex justify-end mt-2">
                <button
                  type="button"
                  onClick={() => router.push("/forgot-password")}
                  className="text-sm text-[#d26c51] hover:underline font-medium"
                >
                  Forgot Password?
                </button>
              </div>
            </div>

            <button
              onClick={handleLogin}
              type="button"
              className="w-full bg-[#235056] text-white p-3 rounded-lg font-bold text-lg hover:bg-[#1a3d42] transition-colors shadow-md"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}