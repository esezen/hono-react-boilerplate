import { z } from "zod";
import { taskSelectSchema } from "../db/schema";
import type { Context } from "hono";
import { eq } from "drizzle-orm";
import { tasks } from "../db/schema";
import { database } from "db";
import { createRoute } from "@hono/zod-openapi";

const deleteSchema = z.object({
  slug: z.string({ description: "Task slug" }),
});

export const taskDeleteRoute = createRoute({
  method: "delete",
  path: "/api/tasks/{slug}",
  summary: "Delete a Task",
  tags: ["Tasks"],
  request: {
    params: deleteSchema,
  },
  responses: {
    200: {
      description: "Returns if the task was deleted successfully",
      content: {
        "application/json": {
          schema: z.object({
            task: taskSelectSchema,
          }),
        },
      },
    },
    500: {
      description: "Failed",
      content: {
        "application/json": {
          schema: z.object({
            error: z.string(),
          }),
        },
      },
    },
  },
});

export const taskDeleteHandler = async (c: Context) => {
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
