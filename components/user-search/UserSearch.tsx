"use client";

import { useState, useEffect } from "react";

export type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
};

type UserSearchProps = {
  apiUrl?: string;
};

export default function UserSearch({
  apiUrl = "https://jsonplaceholder.typicode.com/users",
}: UserSearchProps) {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchUsers() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(apiUrl, { signal: controller.signal });

        if (!response.ok) {
          throw new Error(`Failed to fetch users (status: ${response.status})`);
        }

        const data: User[] = await response.json();
        setUsers(data);
        setFilteredUsers(data);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();

    return () => controller.abort();
  }, [apiUrl]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const lowerQuery = query.toLowerCase();
      setFilteredUsers(
        users.filter(
          (user) =>
            user.name.toLowerCase().includes(lowerQuery) ||
            user.email.toLowerCase().includes(lowerQuery)
        )
      );
    }, 3000);

    return () => clearTimeout(timeout);
  }, [query, users]);

  if (loading)
    return (
      <div className="flex items-center gap-2 text-zinc-500">
        <svg
          className="animate-spin h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
        <p role="status" className="text-sm">Loading users...</p>
      </div>
    );

  if (error)
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p role="alert" className="text-red-700 text-sm font-medium">
          {error}
        </p>
      </div>
    );

  return (
    <div className="space-y-4">
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
          />
        </svg>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search users"
          className="w-full pl-10 pr-4 py-2 border border-zinc-300 rounded-lg text-sm text-black placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <p className="text-xs text-zinc-400">
        {filteredUsers.length} {filteredUsers.length === 1 ? "user" : "users"}{" "}
        found
      </p>

      {filteredUsers.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-zinc-500 text-sm">
            No users found matching &ldquo;{query}&rdquo;
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-zinc-100">
          {filteredUsers.map((user) => (
            <li
              key={user.id}
              data-testid={`user-${user.id}`}
              className="flex items-center justify-between py-3 px-2 hover:bg-zinc-50 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-semibold">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <strong className="block text-sm font-medium text-black">
                    {user.name}
                  </strong>
                  <span className="text-xs text-zinc-500">{user.email}</span>
                </div>
              </div>
              <span className="text-xs text-zinc-400 hidden sm:block">
                {user.phone}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
