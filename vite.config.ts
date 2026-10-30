// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Service worker versionato: la versione deriva dai nomi (con impronta) dei file del client,
// quindi cambia a ogni rilascio e il banner «Nuova Versione disponibile» scatta solo per rilasci reali.
const basexpizzaServiceWorker = {
  name: "basexpizza-service-worker",
  apply: "build" as const,
  generateBundle(
    this: {
      environment?: { name?: string };
      emitFile: (f: { type: "asset"; fileName: string; source: string }) => void;
    },
    _options: unknown,
    bundle: Record<string, unknown>,
  ) {
    if (this.environment?.name && this.environment.name !== "client") return;
    const names = Object.keys(bundle)
      .filter((n) => !n.endsWith(".map") && n !== "sw.js")
      .sort();
    const version = createHash("sha1").update(names.join("|")).digest("hex").slice(0, 12);
    const template = readFileSync(resolve(__dirname, "src/pwa/sw.template.js"), "utf8");
    this.emitFile({
      type: "asset",
      fileName: "sw.js",
      source: template.replace('"__SW_BUILD__"', JSON.stringify(version)),
    });
  },
};

export default defineConfig({
  vite: {
    plugins: [basexpizzaServiceWorker],
    optimizeDeps: {
      // Prebundle the React UI entry points together. Late discovery can leave
      // an open preview mixing optimizer generations with different hook dispatchers.
      include: [
        "react",
        "react-dom",
        "react-dom/client",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "@radix-ui/react-slot",
        "@radix-ui/react-dialog",
        "@radix-ui/react-slider",
      ],
    },
  },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});
