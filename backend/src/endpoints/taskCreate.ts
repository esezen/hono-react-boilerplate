import { Bool, OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { Task } from "../types";
import type { Context } from "hono";
import { database } from "db";
import { tasks } from "../db/schema";

export class TaskCreate extends OpenAPIRoute {
  schema = {
    tags: ["Tasks"],
    summary: "Create a new Task",
    request: {
      body: {
        content: {
          "application/json": {
            schema: Task,
          },
        },
      },
    },
    responses: {
      "200": {
        description: "Returns the created task",
        content: {
          "application/json": {
            schema: z.object({
              series: z.object({
                success: Bool(),
                result: z.object({
                  task: Task,
                }),
              }),
            }),
          },
        },
      },
      "400": {
        description: "Bad request",
        content: {
          "application/json": {
            schema: z.object({
              series: z.object({
                success: Bool(),
                error: z.string(),
              }),
            }),
          },
        },
      },
    },
  };

  async handle(c: Context) {
    // Get validated data
    const data = await this.getValidatedData<typeof this.schema>();

    // Retrieve the validated request body
    const taskToCreate = data.body;
    const db = database(c);

    try {
      const result = await db.insert(tasks).values(taskToCreate).returning();

      // Return the new task
      return c.json({
        success: true,
        result: {
          task: result,
        },
      });
    } catch (error) {
      console.error("Error creating task:", error);
      return c.json(
        {
          success: false,
          error: "Failed to create task",
        },
        {
          status: 500,
        },
      );
    }
  }
}
