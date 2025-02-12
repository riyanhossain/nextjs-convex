import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";

// Create a new task with the given text
export const createTodo = mutation({
  args: { text: v.string() },
  handler: async (ctx, args) => {
    try {
      const newTaskId = await ctx.db.insert("todos", { text: args.text });
      if (!newTaskId) {
        throw new ConvexError("Failed to create a new task");
      }

      return {
        success: true,
        message: "Task created successfully",
      };
    } catch (e) {
      console.log(e);
    }
  },
});

// Get all the tasks
export const getTodos = query({
  handler: async (ctx) => {
    try {
      const todos = await ctx.db.query("todos").collect();
      return {
        todos,
        success: true,
      };
    } catch (e) {
      console.log(e);
    }
  },
});

export const deleteTodo = mutation({
  args: { id: v.id("todos") },
  handler: async (ctx, args) => {
    try {
      await ctx.db.delete(args.id);
      return {
        success: true,
        message: "Task deleted successfully",
      };
    } catch (e) {
      console.log(e);
    }
  },
});
