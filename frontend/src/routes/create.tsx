import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type {
  taskInsertSchema,
  taskSelectSchema,
} from "../../../backend/src/db/schema";
import type { z } from "zod";

const createSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
};

type TaskInsertType = z.infer<typeof taskInsertSchema>;

// Function to submit the task to the API
const createTask = async (
  task: TaskInsertType,
): Promise<{ task: typeof taskSelectSchema }> => {
  const response = await fetch("/api/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });

  if (!response.ok) {
    const errorData = await response.json();

    throw new Error(errorData.message || "Failed to create task");
  }

  return response.json();
};

export const Route = createFileRoute("/create")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    due_date: new Date().toISOString().split("T")[0], // Default to today
  });

  // Mutation for creating a task
  const createTaskMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      navigate({ to: "/" });
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Generate slug from name
    const slug = createSlug(formData.name);

    // Submit the task
    createTaskMutation.mutate({ ...formData, id: 222, slug, completed: false });
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col space-y-6 max-w-2xl mx-auto">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Create New Task</h1>
          <p className="text-muted-foreground">Add a new task to your list</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Task Details</CardTitle>
              <CardDescription>
                Enter the details for your new task
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 mt-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Task Name
                </label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter task name"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description (Optional)
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter task description"
                  className="w-full min-h-[100px] px-3 py-2 border rounded-md"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="due_date" className="text-sm font-medium">
                  Due Date
                </label>
                <Input
                  id="due_date"
                  name="due_date"
                  type="date"
                  value={formData.due_date}
                  onChange={handleChange}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate({ to: "/" })}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createTaskMutation.isPending}>
                {createTaskMutation.isPending ? "Creating..." : "Create Task"}
              </Button>
            </CardFooter>
          </form>
        </Card>

        {createTaskMutation.isError && (
          <div className="p-4 bg-red-50 text-red-700 rounded-md">
            <p>Error: {createTaskMutation.error.message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
