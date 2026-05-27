"use client";
import { useState } from "react";

const getStrength = (password: string) => {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score === 0) return { label: "Too short", level: "weak" };
  if (score <= 2) return { label: "Weak", level: "weak" };
  if (score === 3) return { label: "Medium", level: "medium" };
  return { label: "Strong", level: "strong" };
};

const PasswordStrength = () => {
  const [password, setPassword] = useState("");

  const strength = getStrength(password);

  const strengthColor =
    strength.level === "strong"
      ? "text-green-600"
      : strength.level === "medium"
        ? "text-yellow-600"
        : "text-red-600";

  return (
    <div className="flex flex-col gap-3">
      <label htmlFor="password" className="font-medium text-black">Password</label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter password"
        className="border border-zinc-300 rounded px-3 py-2 text-black"
      />
      {password.length > 0 && (
        <div className="flex flex-col gap-2">
          <p data-testid="strength-label" className={`font-medium ${strengthColor}`}>
            Strength: {strength.label}
          </p>
          <div
            role="meter"
            aria-label="Password strength"
            aria-valuenow={
              strength.level === "weak" ? 1 : strength.level === "medium" ? 2 : 3
            }
            aria-valuemin={1}
            aria-valuemax={3}
          />
          <ul className="flex flex-col gap-1 text-sm">
            <li data-met={password.length >= 8} className={password.length >= 8 ? "text-green-600" : "text-zinc-400"}>
              {password.length >= 8 ? "✓" : "○"} At least 8 characters
            </li>
            <li data-met={/[A-Z]/.test(password)} className={/[A-Z]/.test(password) ? "text-green-600" : "text-zinc-400"}>
              {/[A-Z]/.test(password) ? "✓" : "○"} One uppercase letter
            </li>
            <li data-met={/[0-9]/.test(password)} className={/[0-9]/.test(password) ? "text-green-600" : "text-zinc-400"}>
              {/[0-9]/.test(password) ? "✓" : "○"} One number
            </li>
            <li data-met={/[^A-Za-z0-9]/.test(password)} className={/[^A-Za-z0-9]/.test(password) ? "text-green-600" : "text-zinc-400"}>
              {/[^A-Za-z0-9]/.test(password) ? "✓" : "○"} One special character
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default PasswordStrength;
