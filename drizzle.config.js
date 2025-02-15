// import "dotenv/config";
import { defineConfig } from "drizzle-kit";
export default defineConfig({
  out: "./drizzle",
  schema: "./configs/schema.js",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://aigendb_owner:npg_TUNZq1Hgbky4@ep-weathered-silence-a5vc0anp.us-east-2.aws.neon.tech/aigendb?sslmode=require",
  },
});
