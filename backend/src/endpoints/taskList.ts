import { Bool, OpenAPIRoute } from "chanfana";
import { z } from "zod";
import type { Context } from "hono";
import { database } from "db";
import { tasks, taskSelectSchema } from "../db/schema";
import { eq } from "drizzle-orm";

export class TaskList extends OpenAPIRoute {
  schema = {
    tags: ["Tasks"],
    summary: "List Tasks",
    request: {
      query: z.object({
        isCompleted: Bool({
          description: "Filter by completed flag",
          required: false,
        }),
      }),
    },
    responses: {
      "200": {
        description: "Returns a list of tasks",
        content: {
          "application/json": {
            schema: z.object({
              series: z.object({
                success: Bool(),
                result: z.object({
                  tasks: taskSelectSchema.array(),
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
    const { isCompleted } = data.query;
    const db = database(c);

    try {
      const tasksList = await db.query.tasks.findMany({
        where: eq(tasks.completed, isCompleted),
      });

      return c.json({
        tasks: tasksList,
      });
    } catch (error) {
      console.error("Error fetching tasks:", error);
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
