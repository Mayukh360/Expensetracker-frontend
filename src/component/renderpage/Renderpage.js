import React from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import AuthForm from "../Signup/AuthForm";
import ExpenseTracker from "../expensetracker/ExpenseTracker";
import LeaderBoard from "../expensetracker/LeaderBoard";
import ForgotPassword from "../Signup/ForgotPassword";

const router = createBrowserRouter([
  { path: "/", element: <AuthForm /> },

  { path: "/expensetracker", element: <ExpenseTracker /> },
  { path: "/leaderboard", element: <LeaderBoard /> },
  { path: "/forgotpassword", element: <ForgotPassword/> },
]);
export default function RenderPage() {
  return (
    <RouterProvider router={router}>
      <Outlet />
    </RouterProvider>
  );
}
