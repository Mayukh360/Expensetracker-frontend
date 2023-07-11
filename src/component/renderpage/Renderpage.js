import React from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";

import AuthForm from "../Signup/AuthForm";

import ExpenseTracker from "../expensetracker/ExpenseTracker";

const router = createBrowserRouter([
  { path: "/", element: <AuthForm /> },

  { path: "/expensetracker", element: <ExpenseTracker /> },
]);
export default function RenderPage() {
  return (
    <RouterProvider router={router}>
      <Outlet />
    </RouterProvider>
  );
}
