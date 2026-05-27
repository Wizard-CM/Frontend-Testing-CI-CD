import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect } from "vitest";
import SearchFilter from "./SearchFilter";

const mockItems = [
  { id: 1, name: "React Handbook", category: "books" },
  { id: 2, name: "TypeScript Guide", category: "books" },
  { id: 3, name: "Node.js Course", category: "courses" },
  { id: 4, name: "CSS Masterclass", category: "courses" },
  { id: 5, name: "VS Code", category: "tools" },
];

describe("SearchFilter", () => {
  test("renders all items initially", () => {
    render(<SearchFilter items={mockItems} />);

    expect(screen.getByText("5 results found")).toBeInTheDocument();
    expect(screen.getByText(/React Handbook/)).toBeInTheDocument();
    expect(screen.getByText(/VS Code/)).toBeInTheDocument();
  });

  test("filters items by search query", async () => {
    render(<SearchFilter items={mockItems} />);

    await userEvent.type(screen.getByLabelText("Search items"), "react");

    expect(screen.getByText("1 results found")).toBeInTheDocument();
    expect(screen.getByText(/React Handbook/)).toBeInTheDocument();
    expect(screen.queryByText(/Node.js Course/)).not.toBeInTheDocument();
  });

  test("filters items by category dropdown", async () => {
    render(<SearchFilter items={mockItems} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Filter by category"),
      "courses"
    );

    expect(screen.getByText("2 results found")).toBeInTheDocument();
    expect(screen.getByText(/Node.js Course/)).toBeInTheDocument();
    expect(screen.getByText(/CSS Masterclass/)).toBeInTheDocument();
    expect(screen.queryByText(/React Handbook/)).not.toBeInTheDocument();
  });

  test("combines search query and category filter", async () => {
    render(<SearchFilter items={mockItems} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Filter by category"),
      "books"
    );
    await userEvent.type(screen.getByLabelText("Search items"), "type");

    expect(screen.getByText("1 results found")).toBeInTheDocument();
    expect(screen.getByText(/TypeScript Guide/)).toBeInTheDocument();
  });

  test("shows empty state when no items match", async () => {
    render(<SearchFilter items={mockItems} />);

    await userEvent.type(screen.getByLabelText("Search items"), "xyznotfound");

    expect(screen.getByText("0 results found")).toBeInTheDocument();
    expect(screen.getByText("No items match your search")).toBeInTheDocument();
  });

  test("search is case-insensitive", async () => {
    render(<SearchFilter items={mockItems} />);

    await userEvent.type(screen.getByLabelText("Search items"), "REACT");

    expect(screen.getByText("1 results found")).toBeInTheDocument();
    expect(screen.getByText(/React Handbook/)).toBeInTheDocument();
  });
});
