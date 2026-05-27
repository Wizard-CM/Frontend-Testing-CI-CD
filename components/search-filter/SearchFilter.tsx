"use client";
import { useState } from "react";

type Item = {
  id: number;
  name: string;
  category: string;
};

type SearchFilterProps = {
  items: Item[];
};

const SearchFilter = ({ items }: SearchFilterProps) => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  const categories = ["all", ...new Set(items.map((item) => item.category))];

  const filtered = items.filter((item) => {
    const matchesQuery = item.name.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = category === "all" || item.category === category;
    return matchesQuery && matchesCategory;
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-3">
        <input
          type="search"
          placeholder="Search items..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search items"
          className="border border-zinc-300 rounded px-3 py-2 flex-1 text-black"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="Filter by category"
          className="border border-zinc-300 rounded px-3 py-2 text-black"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <p className="text-zinc-600">{filtered.length} results found</p>

      {filtered.length === 0 ? (
        <p className="text-zinc-500">No items match your search</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {filtered.map((item) => (
            <li key={item.id} className="border border-zinc-200 rounded p-3 text-black">
              {item.name} — <span className="text-zinc-500">{item.category}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchFilter;
