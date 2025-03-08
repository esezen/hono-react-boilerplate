import { Hono } from "hono";
import type { Context } from "hono";
import { database } from "db";
import { taskInsertSchema, tasks } from "../db/schema";

const taskCreateHandler = async (c: Context) => {
  const taskToCreate = taskInsertSchema.parse(await c.req.json());
  const db = database(c);

  try {
    const returnValue = await db.insert(tasks).values(taskToCreate).returning();
    const result = returnValue[0];

    return c.json(
      {
        task: result,
      },
      200,
    );
  } catch (error) {
    console.error("Error creating task:", error);
    return c.json(
      {
        error: "Failed to create task",
      },
      500,
    );
  }
};

export const taskCreateRoute = new Hono().post("/", taskCreateHandler);
