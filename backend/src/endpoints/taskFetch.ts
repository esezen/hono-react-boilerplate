import { Hono } from "hono";
import { z } from "zod";
import type { Context } from "hono";
import { eq } from "drizzle-orm";
import { tasks } from "../db/schema";
import { database } from "db";

const fetchSchema = z.object({
  slug: z.string({ description: "Task slug" }),
});

const taskFetchHandler = async (c: Context) => {
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

export const taskFetchRoute = new Hono().get("/:slug", taskFetchHandler);
