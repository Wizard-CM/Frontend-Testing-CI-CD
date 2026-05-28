"use client";

import { useState, useEffect } from "react";

// 1. Unused variable (no-unused-vars)
const unusedVariable = "I am never used";

// 2. Explicit 'any' type (no-explicit-any)
function processData(data: any) {
  return data;
}

export default function LintFail() {
  // 3. Unused state variable
  const [count, setCount] = useState(0);

  // 4. Missing dependency in useEffect (react-hooks/exhaustive-deps)
  const name = "test";
  useEffect(() => {
    console.log(name);
  }, []);

  return (
    <div>
      {/* 5. Using <img> instead of next/image (no-img-element) */}
      <img src="/photo.jpg" alt="photo" />

      {/* 6. Using <a> instead of next/link (no-html-link-for-pages) */}
      <a href="/about">Go to About</a>

      {processData("hello")}
    </div>
  );
}
