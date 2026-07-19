import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/app.ts"],
  format: ["esm"],
  target: "node20",
  sourcemap: true,
  clean: true,
  dts: false,
});
