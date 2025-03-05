import { Bool, OpenAPIRoute, Str } from "chanfana";
import { z } from "zod";
import { taskSelectSchema } from "../db/schema";
import type { Context } from "hono";
import { eq } from "drizzle-orm";
import { tasks } from "../db/schema";
import { database } from "db";

export class TaskFetch extends OpenAPIRoute {
  schema = {
    tags: ["Tasks"],
    summary: "Get a single Task by slug",
    request: {
      params: z.object({
        taskSlug: Str({ description: "Task slug" }),
      }),
    },
    responses: {
      "200": {
        description: "Returns a single task if found",
        content: {
          "application/json": {
            schema: z.object({
              series: z.object({
                success: Bool(),
                result: z.object({
                  task: taskSelectSchema,
                }),
              }),
            }),
          },
        },
      },
      "404": {
        description: "Task not found",
        content: {
          "application/json": {
            schema: z.object({
              series: z.object({
                success: Bool(),
                error: Str(),
              }),
            }),
          },
        },
      },
    },
  };

  async handle(c: Context) {
    const data = await this.getValidatedData<typeof this.schema>();
    const { taskSlug } = data.params;
    const db = database(c);

    try {
      const task = await db.query.tasks.findFirst({
        where: eq(tasks.slug, taskSlug),
      });

      return c.json({
        task,
      });
    } catch (error) {
      console.error("Error fetching task:", error);
      return Response.json(
        {
          error: "Failed to fetch task",
        },
        {
          status: 500,
        },
      );
    }
  }
}
