import { render, screen, within, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi, beforeEach } from "vitest";
import Home from "./page";

const mockUsers = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", phone: "123-456-7890" },
  { id: 2, name: "Bob Smith", email: "bob@example.com", phone: "234-567-8901" },
  { id: 3, name: "Charlie Brown", email: "charlie@example.com", phone: "345-678-9012" },
  { id: 4, name: "Diana Prince", email: "diana@example.com", phone: "456-789-0123" },
  { id: 5, name: "Edward Cole", email: "edward@example.com", phone: "567-890-1234" },
  { id: 6, name: "Fiona Green", email: "fiona@example.com", phone: "678-901-2345" },
  { id: 7, name: "George Lee", email: "george@example.com", phone: "789-012-3456" },
  { id: 8, name: "Helen Troy", email: "helen@example.com", phone: "890-123-4567" },
  { id: 9, name: "Ivan Petrov", email: "ivan@example.com", phone: "901-234-5678" },
  { id: 10, name: "Jane Doe", email: "jane@example.com", phone: "012-345-6789" },
];

describe("Home page - UserSearch integration", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("renders UserSearch within the page", () => {
    beforeEach(() => {
      vi.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: async () => mockUsers,
      } as Response);
    });

    test("shows loading state when the page first mounts", () => {
      vi.spyOn(global, "fetch").mockReturnValue(new Promise(() => {}));
      render(<Home />);

      expect(screen.getByRole("status")).toHaveTextContent("Loading users...");
    });

    test("displays users after fetch resolves", async () => {
      render(<Home />);

      expect(await screen.findByText("10 users found")).toBeInTheDocument();

      const ul = screen.getByRole("list");
      const items = within(ul).getAllByRole("listitem");
      expect(items).toHaveLength(10);
    });
  });

  describe("search flow works end-to-end within the page", () => {
    beforeEach(() => {
      vi.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: async () => mockUsers,
      } as Response);
    });

    test("user can search and see filtered results", async () => {
      const user = userEvent.setup();
      render(<Home />);

      await screen.findByText("10 users found");

      const input = screen.getByLabelText("Search users");
      await user.type(input, "alice");

      await waitFor(() => {
        const ul = screen.getByRole("list");
        const items = within(ul).getAllByRole("listitem");
        expect(items).toHaveLength(1);
        expect(items[0]).toHaveTextContent("Alice Johnson");
        expect(items[0]).toHaveTextContent("alice@example.com");
      }, { timeout: 5000 });
    });

    test("shows no results message when search has no matches", async () => {
      const user = userEvent.setup();
      render(<Home />);

      await screen.findByText("10 users found");

      const input = screen.getByLabelText("Search users");
      await user.type(input, "xyz");

      expect(await screen.findByText(/No users found matching/, {}, { timeout: 5000 })).toBeInTheDocument();
      expect(screen.getByText("0 users found")).toBeInTheDocument();
    });
  });

  describe("error handling within the page", () => {
    test("displays error when API returns a non-ok response", async () => {
      vi.spyOn(global, "fetch").mockResolvedValue({
        ok: false,
        status: 500,
      } as Response);

      render(<Home />);

      const alert = await screen.findByRole("alert");
      expect(alert).toHaveTextContent("Failed to fetch users (status: 500)");
    });

    test("displays error when fetch throws a network error", async () => {
      vi.spyOn(global, "fetch").mockRejectedValue(new TypeError("Failed to fetch"));

      render(<Home />);

      const alert = await screen.findByRole("alert");
      expect(alert).toHaveTextContent("Failed to fetch");
    });
  });
})
