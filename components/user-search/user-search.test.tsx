import { render, screen, within, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi, beforeEach } from "vitest";
import UserSearch from "./UserSearch";
import { User } from "./UserSearch";

const mockUsers: User[] = [
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

describe("checking the initial state of the component", () => {
  beforeEach(() => {
    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => mockUsers,
    } as Response);
  });

  test("there should be a text of '10 users found' present on the screen", async () => {
    render(<UserSearch />);
    expect(await screen.findByText("10 users found")).toBeInTheDocument();
  });

  test("there should be 10 users displayed on the screen", async () => {
    render(<UserSearch />);
    const ul = await screen.findByRole("list");
    const items = within(ul).getAllByRole("listitem");
    expect(items).toHaveLength(10);
  });
});

describe("checking the filtering logic", () => {
  beforeEach(() => {
    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => mockUsers,
    } as Response);
  });

  test("all users listed on the screen must contain the letter 'le' on their names or emails", async () => {
    const user = userEvent.setup();
    render(<UserSearch />);

    await screen.findByRole("list");
    const input = screen.getByLabelText("Search users");
    await user.type(input, "le");

    const ul = await screen.findByRole("list");
    const items = within(ul).getAllByRole("listitem");
    items.forEach((item) => {
      const text = item.textContent!.toLowerCase();
      expect(text).toContain("le");
    });
  });
});

describe("Matches the condition for user not found on filtering logic", () => {
  beforeEach(() => {
    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => mockUsers,
    } as Response);
  });

  test("the screen must contain 'No users found matching ww' and '0 users found'", async () => {
    const user = userEvent.setup();
    render(<UserSearch />);

    await screen.findByRole("list");
    const input = screen.getByLabelText("Search users");
    await user.type(input, "ww");

    expect(await screen.findByText(/No users found matching/, {}, { timeout: 3000 })).toBeInTheDocument();
    expect(screen.getByText("0 users found")).toBeInTheDocument();
  });
});

describe("checking the loading state", () => {
  test("shows loading text before fetch resolves", async () => {
    vi.spyOn(global, "fetch").mockReturnValue(new Promise(() => {}));
    render(<UserSearch />);

    expect(screen.getByRole("status")).toHaveTextContent("Loading users...");
  });
});

describe("checking the error state", () => {
  beforeEach(() => {
    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: false,
      status: 500,
    } as Response);
  });

  test("shows error message when API fails", async () => {
    render(<UserSearch />);

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("Failed to fetch users (status: 500)");
  });
});

describe("checking the filtering logic matches on email", () => {
  beforeEach(() => {
    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => mockUsers,
    } as Response);
  });

  test("typing an email substring filters users by email", async () => {
    const user = userEvent.setup();
    render(<UserSearch />);

    await screen.findByRole("list");
    const input = screen.getByLabelText("Search users");
    await user.type(input, "alice@");

    await waitFor(() => {
      const ul = screen.getByRole("list");
      const items = within(ul).getAllByRole("listitem");
      expect(items).toHaveLength(1);
      expect(items[0]).toHaveTextContent("Alice Johnson");
    }, { timeout: 3000 });
  });
});
