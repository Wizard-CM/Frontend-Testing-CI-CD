import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect } from "vitest";
import PasswordStrength from "./PasswordStrength";

describe("PasswordStrength", () => {
  test("does not show strength indicator when input is empty", () => {
    render(<PasswordStrength />);

    expect(screen.queryByTestId("strength-label")).not.toBeInTheDocument();
  });

  test("shows 'Too short' for short lowercase-only password", async () => {
    render(<PasswordStrength />);

    await userEvent.type(screen.getByLabelText("Password"), "abc");

    expect(screen.getByTestId("strength-label")).toHaveTextContent(
      "Strength: Too short"
    );
  });

  test("shows 'Weak' for password meeting 1-2 criteria", async () => {
    render(<PasswordStrength />);

    // 8+ chars but only lowercase = score 1 (length only)
    await userEvent.type(screen.getByLabelText("Password"), "abcdefgh");

    expect(screen.getByTestId("strength-label")).toHaveTextContent(
      "Strength: Weak"
    );
  });

  test("shows 'Medium' for password meeting 3 criteria", async () => {
    render(<PasswordStrength />);

    // 8+ chars + uppercase + number = score 3
    await userEvent.type(screen.getByLabelText("Password"), "Abcdefg1");

    expect(screen.getByTestId("strength-label")).toHaveTextContent(
      "Strength: Medium"
    );
  });

  test("shows 'Strong' for password meeting all 4 criteria", async () => {
    render(<PasswordStrength />);

    // 8+ chars + uppercase + number + special char = score 4
    await userEvent.type(screen.getByLabelText("Password"), "Abcdefg1!");

    expect(screen.getByTestId("strength-label")).toHaveTextContent(
      "Strength: Strong"
    );
  });

  test("updates criteria checklist as requirements are met", async () => {
    render(<PasswordStrength />);

    await userEvent.type(screen.getByLabelText("Password"), "abcdefgh");

    const lengthItem = screen.getByText(/At least 8 characters/);
    const uppercaseItem = screen.getByText(/One uppercase letter/);

    expect(lengthItem).toHaveAttribute("data-met", "true");
    expect(uppercaseItem).toHaveAttribute("data-met", "false");
  });
});
