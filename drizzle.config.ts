import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });

export default {
	driver: "pg",
	schema: "./src/lib/db/schema.ts", // npx drizzle-kit push:pg to push the schema to the neon db
	dbCredentials: {
		connectionString: process.env.DATABASE_URL!,
	},
} satisfies Config;
