"use client";

import { useState } from "react";
import { createUser } from "@/app/lib/users_actions/users";

export default function CreateUser() {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;

    setLoading(true);
    setErrors({});
    setMessage("");

    const formData = new FormData(form);

    const result = await createUser(formData);

    // check for errors
    if (!result?.success) {
      if (result?.errors) {
        setErrors(result.errors);
      } else {
        setMessage(result?.message || "Something went wrong");
      }
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 border rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Create User</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label>Name</label>
          <input
            name="name"
            type="text"
            className="w-full border p-2 rounded"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name[0]}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label>Email</label>
          <input
            name="email"
            type="email"
            className="w-full border p-2 rounded"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email[0]}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label>Password</label>
          <input
            name="password"
            type="password"
            className="w-full border p-2 rounded"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password[0]}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          {loading ? "Creating..." : "Create User"}
        </button>
      </form>

      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
}
