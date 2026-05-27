import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi, beforeEach } from "vitest";
import ShoppingCart from "./ShoppingCart";
import { fetchProducts } from "./api";

vi.mock("./api", () => ({
  fetchProducts: vi.fn(),
}));

const mockFetchProducts = fetchProducts as ReturnType<typeof vi.fn>;

const mockProducts = [
  { id: 1, name: "Wireless Mouse", price: 29.99, image: "" },
  { id: 2, name: "Mechanical Keyboard", price: 89.99, image: "" },
  { id: 3, name: "USB Hub", price: 19.99, image: "" },
];

describe("ShoppingCart (integration)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  test("shows loading state initially", () => {
    mockFetchProducts.mockImplementation(() => new Promise(() => {}));
    render(<ShoppingCart />);

    expect(screen.getByText("Loading products...")).toBeInTheDocument();
  });

  test("shows error when product fetch fails", async () => {
    mockFetchProducts.mockRejectedValue(new Error("Network error"));
    render(<ShoppingCart />);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Could not load products"
    );
  });

  test("displays products after loading", async () => {
    mockFetchProducts.mockResolvedValue(mockProducts);
    render(<ShoppingCart />);

    expect(await screen.findByText("Wireless Mouse")).toBeInTheDocument();
    expect(screen.getByText("Mechanical Keyboard")).toBeInTheDocument();
    expect(screen.getByText("USB Hub")).toBeInTheDocument();
  });

  test("shows empty cart initially", async () => {
    mockFetchProducts.mockResolvedValue(mockProducts);
    render(<ShoppingCart />);

    await screen.findByText("Wireless Mouse");

    expect(screen.getByText("Your cart is empty")).toBeInTheDocument();
    expect(screen.getByText("Items: 0")).toBeInTheDocument();
    expect(screen.getByText("Subtotal: $0.00")).toBeInTheDocument();
  });

  test("adds product to cart and updates summary", async () => {
    mockFetchProducts.mockResolvedValue(mockProducts);
    render(<ShoppingCart />);

    await screen.findByText("Wireless Mouse");

    const addButtons = screen.getAllByRole("button", { name: "Add to cart" });
    await userEvent.click(addButtons[0]); // Add Wireless Mouse

    expect(screen.getByText("Items: 1")).toBeInTheDocument();
    expect(screen.getByText("Subtotal: $29.99")).toBeInTheDocument();
    expect(
      screen.getByLabelText("Wireless Mouse quantity")
    ).toHaveTextContent("1");
  });

  test("increases quantity when same product added twice", async () => {
    mockFetchProducts.mockResolvedValue(mockProducts);
    render(<ShoppingCart />);

    await screen.findByText("Wireless Mouse");

    const addButtons = screen.getAllByRole("button", { name: "Add to cart" });
    await userEvent.click(addButtons[0]);
    await userEvent.click(addButtons[0]);

    expect(
      screen.getByLabelText("Wireless Mouse quantity")
    ).toHaveTextContent("2");
    expect(screen.getByText("Items: 2")).toBeInTheDocument();
    expect(screen.getByText("Subtotal: $59.98")).toBeInTheDocument();
  });

  test("increases and decreases quantity with +/- buttons", async () => {
    mockFetchProducts.mockResolvedValue(mockProducts);
    render(<ShoppingCart />);

    await screen.findByText("Wireless Mouse");

    // Add to cart
    const addButtons = screen.getAllByRole("button", { name: "Add to cart" });
    await userEvent.click(addButtons[0]);

    // Increase
    await userEvent.click(
      screen.getByLabelText("Increase Wireless Mouse quantity")
    );
    expect(
      screen.getByLabelText("Wireless Mouse quantity")
    ).toHaveTextContent("2");

    // Decrease
    await userEvent.click(
      screen.getByLabelText("Decrease Wireless Mouse quantity")
    );
    expect(
      screen.getByLabelText("Wireless Mouse quantity")
    ).toHaveTextContent("1");
  });

  test("removes item from cart when decrease reaches 0", async () => {
    mockFetchProducts.mockResolvedValue(mockProducts);
    render(<ShoppingCart />);

    await screen.findByText("Wireless Mouse");

    const addButtons = screen.getAllByRole("button", { name: "Add to cart" });
    await userEvent.click(addButtons[0]);

    await userEvent.click(
      screen.getByLabelText("Decrease Wireless Mouse quantity")
    );

    expect(screen.getByText("Your cart is empty")).toBeInTheDocument();
  });

  test("removes item from cart with remove button", async () => {
    mockFetchProducts.mockResolvedValue(mockProducts);
    render(<ShoppingCart />);

    await screen.findByText("Wireless Mouse");

    const addButtons = screen.getAllByRole("button", { name: "Add to cart" });
    await userEvent.click(addButtons[0]);

    await userEvent.click(
      screen.getByLabelText("Remove Wireless Mouse from cart")
    );

    expect(screen.getByText("Your cart is empty")).toBeInTheDocument();
    expect(screen.getByText("Items: 0")).toBeInTheDocument();
  });

  test("checkout clears cart and shows confirmation", async () => {
    mockFetchProducts.mockResolvedValue(mockProducts);
    render(<ShoppingCart />);

    await screen.findByText("Wireless Mouse");

    // Add two different products
    const addButtons = screen.getAllByRole("button", { name: "Add to cart" });
    await userEvent.click(addButtons[0]); // Wireless Mouse $29.99
    await userEvent.click(addButtons[1]); // Mechanical Keyboard $89.99

    await userEvent.click(screen.getByRole("button", { name: "Checkout" }));

    expect(screen.getByRole("status")).toHaveTextContent(
      "Order placed! 2 items for $119.98"
    );
    expect(screen.getByText("Your cart is empty")).toBeInTheDocument();
  });

  test("checkout button is disabled when cart is empty", async () => {
    mockFetchProducts.mockResolvedValue(mockProducts);
    render(<ShoppingCart />);

    await screen.findByText("Wireless Mouse");

    expect(screen.getByRole("button", { name: "Checkout" })).toBeDisabled();
  });
});
