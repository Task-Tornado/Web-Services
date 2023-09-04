import type { Config } from "tailwindcss";

import baseConfig from "@task-tornado/tailwind-config";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  presets: [baseConfig],
} satisfies Config;
