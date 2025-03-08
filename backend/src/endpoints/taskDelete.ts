import { Hono } from "hono";
import { z } from "zod";
import type { Context } from "hono";
import { eq } from "drizzle-orm";
import { tasks } from "../db/schema";
import { database } from "db";

const deleteSchema = z.object({
  slug: z.string({ description: "Task slug" }),
});

const taskDeleteHandler = async (c: Context) => {
  const taskToDelete = deleteSchema.parse(c.req.param());
  const db = database(c);

  try {
    const returnValue = await db
      .delete(tasks)
      .where(eq(tasks.slug, taskToDelete.slug))
      .returning();
    const result = returnValue[0];

    return c.json(
      {
        task: result,
      },
      200,
    );
  } catch (error) {
    console.error("Error deleting task:", error);
    return c.json(
      {
        error: "Failed to delete task",
      },
      {
        status: 500,
      },
    );
  }
};

export const taskDeleteRoute = new Hono().delete("/:slug", taskDeleteHandler);
