import { db } from "./index.ts";
import { properties } from "../shared/schema.ts";

async function clearProperties() {
  try {
    console.log("Clearing properties table...");
    await db.delete(properties);
    console.log("Properties table cleared successfully.");
  } catch (error) {
    console.error("Error clearing properties table:", error);
    process.exit(1);
  }
}

clearProperties();