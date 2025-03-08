import { Hono } from "hono";
import { logger } from "hono/logger";

import { taskDeleteRoute } from "endpoints/taskDelete";
import { taskCreateRoute } from "endpoints/taskCreate";
import { taskFetchRoute } from "endpoints/taskFetch";
import { taskListRoute } from "endpoints/taskList";

const app = new Hono();

app.use("*", logger());

const routes = [
  taskListRoute,
  taskDeleteRoute,
  taskFetchRoute,
  taskCreateRoute,
];

for (const route of routes) {
  app.basePath("/api").route("/tasks", route);
}

export default app;
export type AppType = typeof app;
