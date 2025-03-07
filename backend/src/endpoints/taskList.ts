import { z } from "zod";
import { taskSelectSchema } from "../db/schema";
import type { Context } from "hono";
import { eq } from "drizzle-orm";
import { tasks } from "../db/schema";
import { database } from "db";
import { createRoute } from "@hono/zod-openapi";

const listSchema = z.object({
  isCompleted: z
    .boolean({
      description: "Filter by completed flag",
    })
    .optional(),
});

export const taskListRoute = createRoute({
  method: "get",
  path: "/api/tasks",
  summary: "List Tasks",
  tags: ["Tasks"],
  request: {
    query: listSchema,
  },
  responses: {
    200: {
      description: "Returns a list of tasks",
      content: {
        "application/json": {
          schema: z.object({
            tasks: taskSelectSchema.array(),
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

export const taskListHandler = async (c: Context) => {
  const params = listSchema.parse(c.req.query());
  const { isCompleted } = params;
  const db = database(c);

  try {
    const tasksList = await db.query.tasks.findMany({
      where:
        isCompleted !== undefined
          ? eq(tasks.completed, isCompleted)
          : undefined,
    });

    return c.json(
      {
        tasks: tasksList,
      },
      200,
    );
  } catch (error) {
    console.error("Error fetching tasks:", error);
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
