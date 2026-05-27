export type LoginResponse = {
  token: string;
  user: {
    name: string;
    email: string;
  };
};

export async function loginUser(
  email: string,
  password: string
): Promise<LoginResponse> {
  const res = await fetch("https://api.example.com/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (res.status === 401) throw new Error("Invalid email or password");
  if (!res.ok) throw new Error("Something went wrong. Please try again.");

  return res.json();
}
