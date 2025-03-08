import { Hono } from "hono";
import type { Context } from "hono";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { tasks } from "../db/schema";
import { database } from "db";

const listSchema = z.object({
  isCompleted: z
    .boolean({
      description: "Filter by completed flag",
    })
    .optional(),
});

const taskListHandler = async (c: Context) => {
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

export const taskListRoute = new Hono().get("/", taskListHandler);
