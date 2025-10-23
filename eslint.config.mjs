import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  // Extend Next.js configs
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Add ignores in the flat config format
  {
    ignores: ["lib/generate/**"],
  },
];
