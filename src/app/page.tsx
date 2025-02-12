"use client";

import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { api } from "~/convex/_generated/api";
import { Id } from "~/convex/_generated/dataModel";

export default function Home() {
  const [input, setInput] = useState("");
  const resetInput = () => setInput("");
  const createTodo = useMutation(api.todo.createTodo);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input) return;

    // Call the createTodo mutation with the input value
    const res = await createTodo({
      text: input,
    });

    if (!res) return;

    if (res.success) {
      console.log(res.message);
    }

    resetInput();
  };

  return (
    <section className="max-w-2xl w-full mx-auto py-8 px-5 space-y-4">
      <h1 className="text-center text-2xl lg:text-5xl font-semibold ">Todo</h1>

      <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-4">
        <input
          type="text"
          className="w-full border border-gray-300 rounded p-2 mt-2 text-black"
          placeholder="Add a new todo"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="submit"
          className="w-full lg:max-w-[120px] bg-blue-500 text-white p-2 rounded mt-2"
        >
          Add
        </button>
      </form>

      <TodoList />
    </section>
  );
}

export function TodoList() {
  const todos = useQuery(api.todo.getTodos);
  const deleteTodo = useMutation(api.todo.deleteTodo);

  const handleDelete = async (id: Id<"todos">) => {
    // Call the deleteTodo mutation with the id of the todo to delete
    const res = await deleteTodo({
      id,
    });

    if (!res) return;

    if (res.success) {
      console.log(res.message);
    }
  };

  if (!todos) return <p>Loading...</p>;

  if (!todos.success) return <p>Failed to load todos</p>;

  return (
    <ul>
      {todos.todos.map((todo) => (
        <li
          key={todo._id}
          className="flex justify-between items-center gap-x-2 bg-gray-800 rounded"
        >
          <p className="flex-1 pl-1">{todo.text}</p>

          <button
            onClick={() => handleDelete(todo._id)}
            className="w-full lg:max-w-[120px] bg-red-500 text-white p-2 rounded"
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
