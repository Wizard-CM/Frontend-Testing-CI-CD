import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi, beforeEach } from "vitest";
import LoginForm from "./LoginForm";
import { loginUser } from "./api";

vi.mock("./api", () => ({
  loginUser: vi.fn(),
}));

const mockLoginUser = loginUser as ReturnType<typeof vi.fn>;

describe("LoginForm", () => {
  let mockOnSuccess: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.restoreAllMocks();
    mockOnSuccess = vi.fn();
  });

  describe("validation", () => {
    test("shows error when email is empty", async () => {
      render(<LoginForm onSuccess={mockOnSuccess} />);

      await userEvent.click(screen.getByRole("button", { name: "Sign In" }));

      expect(screen.getByRole("alert")).toHaveTextContent("Email is required");
    });

    test("shows error when password is empty", async () => {
      render(<LoginForm onSuccess={mockOnSuccess} />);

      await userEvent.type(screen.getByLabelText("Email"), "test@example.com");
      await userEvent.click(screen.getByRole("button", { name: "Sign In" }));

      expect(screen.getByRole("alert")).toHaveTextContent(
        "Password is required"
      );
    });

    test("shows error when password is too short", async () => {
      render(<LoginForm onSuccess={mockOnSuccess} />);

      await userEvent.type(screen.getByLabelText("Email"), "test@example.com");
      await userEvent.type(screen.getByLabelText("Password"), "abc");
      await userEvent.click(screen.getByRole("button", { name: "Sign In" }));

      expect(screen.getByRole("alert")).toHaveTextContent(
        "Password must be at least 6 characters"
      );
    });

    test("does not call loginUser when validation fails", async () => {
      render(<LoginForm onSuccess={mockOnSuccess} />);

      await userEvent.click(screen.getByRole("button", { name: "Sign In" }));

      expect(mockLoginUser).not.toHaveBeenCalled();
    });
  });

  describe("successful login", () => {
    test("calls onSuccess with token and username", async () => {
      mockLoginUser.mockResolvedValue({
        token: "abc123",
        user: { name: "Ronak", email: "ronak@example.com" },
      });

      render(<LoginForm onSuccess={mockOnSuccess} />);

      await userEvent.type(screen.getByLabelText("Email"), "ronak@example.com");
      await userEvent.type(screen.getByLabelText("Password"), "password123");
      await userEvent.click(screen.getByRole("button", { name: "Sign In" }));

      expect(mockLoginUser).toHaveBeenCalledWith(
        "ronak@example.com",
        "password123"
      );
      expect(mockOnSuccess).toHaveBeenCalledWith("abc123", "Ronak");
    });

    test("shows loading state while submitting", async () => {
      // loginUser that never resolves — keeps component in loading state
      mockLoginUser.mockImplementation(() => new Promise(() => {}));

      render(<LoginForm onSuccess={mockOnSuccess} />);

      await userEvent.type(screen.getByLabelText("Email"), "test@example.com");
      await userEvent.type(screen.getByLabelText("Password"), "password123");
      await userEvent.click(screen.getByRole("button", { name: "Sign In" }));

      expect(screen.getByRole("button")).toHaveTextContent("Signing in...");
      expect(screen.getByRole("button")).toBeDisabled();
    });
  });

  describe("failed login", () => {
    test("shows error message from server (invalid credentials)", async () => {
      mockLoginUser.mockRejectedValue(new Error("Invalid email or password"));

      render(<LoginForm onSuccess={mockOnSuccess} />);

      await userEvent.type(screen.getByLabelText("Email"), "test@example.com");
      await userEvent.type(screen.getByLabelText("Password"), "wrongpass");
      await userEvent.click(screen.getByRole("button", { name: "Sign In" }));

      expect(await screen.findByRole("alert")).toHaveTextContent(
        "Invalid email or password"
      );
      expect(mockOnSuccess).not.toHaveBeenCalled();
    });

    test("shows generic error for unexpected failures", async () => {
      mockLoginUser.mockRejectedValue(
        new Error("Something went wrong. Please try again.")
      );

      render(<LoginForm onSuccess={mockOnSuccess} />);

      await userEvent.type(screen.getByLabelText("Email"), "test@example.com");
      await userEvent.type(screen.getByLabelText("Password"), "password123");
      await userEvent.click(screen.getByRole("button", { name: "Sign In" }));

      expect(await screen.findByRole("alert")).toHaveTextContent(
        "Something went wrong. Please try again."
      );
    });

    test("re-enables button after failed login", async () => {
      mockLoginUser.mockRejectedValue(new Error("Server error"));

      render(<LoginForm onSuccess={mockOnSuccess} />);

      await userEvent.type(screen.getByLabelText("Email"), "test@example.com");
      await userEvent.type(screen.getByLabelText("Password"), "password123");
      await userEvent.click(screen.getByRole("button", { name: "Sign In" }));

      await screen.findByRole("alert");
      expect(screen.getByRole("button")).not.toBeDisabled();
      expect(screen.getByRole("button")).toHaveTextContent("Sign In");
    });
  });
});
