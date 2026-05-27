export type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
};

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch("https://api.example.com/products");
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}
