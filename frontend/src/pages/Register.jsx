import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import RegisterForm from "@/components/auth/RegisterForm";
import api from "@/services/api";
import { useAuth } from "@/context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (data) => {
    try {
      const response = await api.post("/auth/register", {
        name: data.name,
        email: data.email,
        password: data.password,
      });
      login(response.data.token, response.data.user); // Set both token and user
      navigate("/dashboard");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          error.message ||
          "Registration failed. Please try again."
      );
    }
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-950 to-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
    >
      <motion.div
        className="w-full max-w-md p-8 space-y-8 rounded-xl shadow-lg bg-white/10 backdrop-blur-md border border-white/20"
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        <div className="text-center">
          <motion.h1
            className="text-3xl font-bold text-gray-100"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            Create your account
          </motion.h1>
          <motion.p
            className="mt-2 text-gray-400"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Sign up to get started
          </motion.p>
        </div>
        <RegisterForm onSubmit={handleSubmit} />
        <div className="text-center text-gray-400 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-primary-400 underline">
            Login
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}
