import vinext from "vinext";
import { defineConfig } from "vite";
import hostingConfig from "./.openai/hosting.json";
import { sites } from "./build/sites-vite-plugin";

const SITE_CREATOR_PLACEHOLDER_DATABASE_ID =
  "00000000-0000-4000-8000-000000000000";

const { d1, r2 } = hostingConfig;

// macOS Seatbelt blocks FSEvents, so Codex previews need polling for HMR.
const isCodexSeatbeltSandbox = process.env.CODEX_SANDBOX === "seatbelt";

const localBindingConfig = {
  main: "./worker/index.ts",
  compatibility_flags: ["nodejs_compat"],
  d1_databases: d1
    ? [
        {
          binding: d1,
          database_name: "site-creator-d1",
          database_id: SITE_CREATOR_PLACEHOLDER_DATABASE_ID,
        },
      ]
    : [],
  r2_buckets: r2
    ? [
        {
          binding: r2,
          bucket_name: "site-creator-r2",
        },
      ]
    : [],
};

// Local development, `npm test`, and the Codex Sites hosting use the
// Cloudflare runtime. Builds on Vercel (which sets VERCEL=1) or with
// NITRO_PRESET set use vinext's Nitro integration instead, which emits a
// platform-appropriate server into `.output`.
const useNitro = Boolean(process.env.VERCEL || process.env.NITRO_PRESET);

export default defineConfig(async () => {
  if (useNitro) {
    const { nitro } = await import("nitro/vite");
    // Under the Nitro environments, Vite's CSS resolver does not resolve the
    // bare `@import "tailwindcss"` specifier the way the Cloudflare build
    // does, so point it at the concrete stylesheet.
    return {
      resolve: {
        alias: {
          tailwindcss: new URL("./node_modules/tailwindcss/index.css", import.meta.url).pathname,
        },
      },
      plugins: [vinext(), sites(), nitro()],
    };
  }

  // Keep Wrangler and Miniflare state project-local. These are non-secret tool
  // settings; application environment belongs in ignored `.env*` files.
  process.env.WRANGLER_WRITE_LOGS ??= "false";
  process.env.WRANGLER_LOG_PATH ??= ".wrangler/logs";
  process.env.MINIFLARE_REGISTRY_PATH ??= ".wrangler/registry";

  // Wrangler snapshots its log path while the Cloudflare plugin is imported.
  const { cloudflare } = await import("@cloudflare/vite-plugin");

  return {
    server: isCodexSeatbeltSandbox
      ? { watch: { useFsEvents: false, usePolling: true } }
      : undefined,
    plugins: [
      vinext(),
      sites(),
      cloudflare({
        viteEnvironment: { name: "rsc", childEnvironments: ["ssr"] },
        config: localBindingConfig,
      }),
    ],
  };
});
