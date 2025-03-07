import { z } from "zod";
import type { Context } from "hono";
import { database } from "db";
import { taskInsertSchema, tasks, taskSelectSchema } from "../db/schema";
import { createRoute } from "@hono/zod-openapi";

export const taskCreateRoute = createRoute({
  method: "post",
  path: "/api/tasks",
  summary: "Create a new task",
  tags: ["Tasks"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: taskInsertSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Returns the created task",
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

export const taskCreateHandler = async (c: Context) => {
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
