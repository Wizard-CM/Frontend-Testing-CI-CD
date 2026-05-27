"use client";
import { useState } from "react";
import { loginUser } from "./api";

type LoginFormProps = {
  onSuccess: (token: string, userName: string) => void;
};

const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!email.trim()) return "Email is required";
    if (!/\S+@\S+\.\S+/.test(email)) return "Please enter a valid email";
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const data = await loginUser(email, password);
      onSuccess(data.token, data.user.name);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} aria-label="Login form" className="flex flex-col gap-4 max-w-sm">
      <h2 className="text-lg font-semibold text-black">Sign In</h2>

      {error && <p role="alert" className="text-red-600 bg-red-50 border border-red-200 rounded p-3">{error}</p>}

      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="font-medium text-black">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="border border-zinc-300 rounded px-3 py-2 text-black"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="font-medium text-black">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          className="border border-zinc-300 rounded px-3 py-2 text-black"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-black text-white rounded px-4 py-2 font-medium hover:bg-zinc-800 disabled:bg-zinc-400"
      >
        {loading ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
};

export default LoginForm;
