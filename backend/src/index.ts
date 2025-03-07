import { OpenAPIHono } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";
import { taskDeleteHandler, taskDeleteRoute } from "endpoints/taskDelete";
import { taskCreateRoute, taskCreateHandler } from "endpoints/taskCreate";
import { taskFetchHandler, taskFetchRoute } from "endpoints/taskFetch";
import { taskListHandler, taskListRoute } from "endpoints/taskList";

type Bindings = {
  DB: D1Database;
};

const app = new OpenAPIHono<{ Bindings: Bindings }>();

app.openapi(taskCreateRoute, taskCreateHandler);
app.openapi(taskDeleteRoute, taskDeleteHandler);
app.openapi(taskFetchRoute, taskFetchHandler);
app.openapi(taskListRoute, taskListHandler);

app.doc("/doc", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "Task API",
  },
});
app.get("/", swaggerUI({ url: "/doc" }));

export default app;
export type AppType = typeof app;
