import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Disable any ESLint rules that conflict with Prettier formatting.
  prettier,
  {
    rules: {
      // Allow console.warn / console.error for genuine signals,
      // forbid casual console.log in shipped code.
      "no-console": ["warn", { allow: ["warn", "error"] }],
      // Existing codebase has ~14 `any` usages from before strictness was on.
      // Downgrade to warn so commits aren't blocked while we type them in a
      // focused follow-up PR. Re-promote to error once that lands.
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
  // React Three Fiber's render loop legitimately mutates refs each frame inside
  // `useFrame` and reads from a scroll ref during render — both look "impure"
  // to React's compiler-aware lint rules but are the documented R3F pattern.
  {
    files: ["components/landing/**Scene3D.tsx"],
    rules: {
      "react-hooks/purity": "off",
      "react-hooks/immutability": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
