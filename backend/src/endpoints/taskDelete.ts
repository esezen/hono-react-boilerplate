import { Bool, OpenAPIRoute, Str } from "chanfana";
import { z } from "zod";
import { taskSelectSchema } from "../db/schema";
import type { Context } from "hono";
import { eq } from "drizzle-orm";
import { tasks } from "../db/schema";
import { database } from "db";

export class TaskDelete extends OpenAPIRoute {
  schema = {
    tags: ["Tasks"],
    summary: "Delete a Task",
    request: {
      params: z.object({
        taskSlug: Str({ description: "Task slug" }),
      }),
    },
    responses: {
      "200": {
        description: "Returns if the task was deleted successfully",
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
    },
  };

  async handle(c: Context) {
    const data = await this.getValidatedData<typeof this.schema>();
    const { taskSlug } = data.params;
    const db = database(c);

    try {
      const task = await db
        .delete(tasks)
        .where(eq(tasks.slug, taskSlug))
        .returning();

      return c.json({
        result: {
          task,
        },
      });
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
  }
}
