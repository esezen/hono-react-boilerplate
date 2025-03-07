import { z } from "zod";
import { taskSelectSchema } from "../db/schema";
import type { Context } from "hono";
import { eq } from "drizzle-orm";
import { tasks } from "../db/schema";
import { database } from "db";
import { createRoute } from "@hono/zod-openapi";

const fetchSchema = z.object({
  slug: z.string({ description: "Task slug" }),
});

export const taskFetchRoute = createRoute({
  method: "get",
  path: "/api/tasks/{slug}",
  summary: "Get a single Task by slug",
  tags: ["Tasks"],
  request: {
    params: fetchSchema,
  },
  responses: {
    200: {
      description: "Returns a single task if found",
      content: {
        "application/json": {
          schema: z.object({
            task: taskSelectSchema,
          }),
        },
      },
    },
    404: {
      description: "Task not found",
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

export const taskFetchHandler = async (c: Context) => {
  const taskToFetch = fetchSchema.parse(c.req.param());
  const db = database(c);

  try {
    const task = await db.query.tasks.findFirst({
      where: eq(tasks.slug, taskToFetch.slug),
    });

    if (task) {
      return c.json(
        {
          task,
        },
        200,
      );
    }

    return c.json({}, 404);
  } catch (error) {
    console.error("Error fetching task:", error);
    return c.json(
      {
        error: "Failed to fetch task",
      },
      {
        status: 500,
      },
    );
  }
};
