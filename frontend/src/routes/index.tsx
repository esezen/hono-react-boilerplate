import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import type { Task } from "../../../backend/src/db/schema";
import { CalendarIcon, CheckCircle2Icon, CircleIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Define the response type
interface TasksResponse {
  tasks: Task[];
}

// Function to fetch tasks from the API
const fetchTasks = async (): Promise<TasksResponse> => {
  const response = await fetch("/api/tasks");

  if (!response.ok) {
    throw new Error("Failed to fetch tasks");
  }

  return response.json();
};

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  // Use React Query to fetch tasks
  const { data, isLoading, isError, error } = useQuery<TasksResponse>({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
  });

  // Handle loading state
  if (isLoading) {
    return (
      <div className="p-2">
        <h3>Loading tasks...</h3>
      </div>
    );
  }

  // Handle error state
  if (isError) {
    return (
      <div className="p-2">
        <h3>Error loading tasks</h3>
        <p>{error?.message || "Unknown error"}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground">Manage and track your tasks</p>
        </div>

        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div className="flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0">
            <Button asChild>
              <Link to="/create">Add New Task</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data?.tasks.map((task) => (
            <Link
              key={task.id}
              to="/$taskSlug"
              params={{
                taskSlug: task.slug,
              }}
            >
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="line-clamp-1 text-lg">
                      {task.name}
                    </CardTitle>
                    {task.completed ? (
                      <CheckCircle2Icon className="h-5 w-5 text-green-500" />
                    ) : (
                      <CircleIcon className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <CardDescription className="line-clamp-2 min-h-[40px]">
                    {task.description || "No description provided"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <CalendarIcon className="h-4 w-4" />
                    <span>
                      Due: {new Date(task.due_date).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="flex flex-wrap gap-2">
                    {task.completed ? (
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 hover:bg-green-50"
                      >
                        Completed
                      </Badge>
                    ) : (
                      <Badge variant="outline">Pending</Badge>
                    )}
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
