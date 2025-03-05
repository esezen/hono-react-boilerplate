import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";
import type { Context } from "hono";

export function database(context: Context) {
  const { env } = context;
  const db = drizzle(env.DB, { schema });

  return db;
}
