import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi } from "vitest";
import NotificationBanner from "./NotificationBanner";

describe("NotificationBanner", () => {
  test("renders the message text", () => {
    render(<NotificationBanner type="success" message="File uploaded" />);
    expect(screen.getByText("File uploaded")).toBeInTheDocument();
  });

  test("renders with the correct type attribute", () => {
    render(<NotificationBanner type="error" message="Something failed" />);
    expect(screen.getByRole("alert")).toHaveAttribute("data-type", "error");
  });

  test("does not show dismiss button by default", () => {
    render(<NotificationBanner type="info" message="Hello" />);
    expect(
      screen.queryByRole("button", { name: /dismiss/i })
    ).not.toBeInTheDocument();
  });

  test("shows dismiss button when dismissible is true", () => {
    render(
      <NotificationBanner type="warning" message="Watch out" dismissible />
    );
    expect(
      screen.getByRole("button", { name: /dismiss/i })
    ).toBeInTheDocument();
  });

  test("calls onDismiss when dismiss button is clicked", async () => {
    const handleDismiss = vi.fn();
    render(
      <NotificationBanner
        type="info"
        message="Dismissible"
        dismissible
        onDismiss={handleDismiss}
      />
    );

    await userEvent.click(screen.getByRole("button", { name: /dismiss/i }));
    expect(handleDismiss).toHaveBeenCalledTimes(1);
  });
});
