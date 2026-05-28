"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

// 2. Explicit 'any' type (no-explicit-any)
function processData<T>(data: T) {
  return data;
}

export default function LintFail() {
  // 4. Missing dependency in useEffect (react-hooks/exhaustive-deps)
  const name = "test";
  useEffect(() => {
    console.log(name);
  }, [name]);

  return (
    <div>
      {/* 5. Using <img> instead of next/image (no-img-element) */}
      <Image src="/photo.jpg" alt="photo" width={640} height={480} />

      {/* 6. Using <a> instead of next/link (no-html-link-for-pages) */}
      <Link href="/about">Go to About</Link>

      {processData("hello")}
    </div>
  );
}
