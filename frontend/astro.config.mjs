import { defineConfig, envField } from "astro/config"
import tailwind from '@astrojs/tailwind';

import react from "@astrojs/react";

import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config


export default defineConfig({
  integrations: [tailwind(), react()],

  experimental: {
    env: {
      schema: {
        PUBLIC_SERVER_URL: envField.string({ context: "client", access: "public" }),
        PUBLIC_CLIENT_URL: envField.string({ context: "client", access: "public" }),

      }
    }
  },

  output: "server",
  adapter: vercel()
})