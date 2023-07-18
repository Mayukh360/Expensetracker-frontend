import React from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import AuthForm from "../Signup/AuthForm";
import ExpenseTracker from "../expensetracker/ExpenseTracker";
import LeaderBoard from "../expensetracker/LeaderBoard";
import ForgotPassword from "../Signup/ForgotPassword";
import Alldownload from "../expensetracker/Alldownload";

const router = createBrowserRouter([
  { path: "/", element: <AuthForm /> },

  { path: "/expensetracker", element: <ExpenseTracker /> },
  { path: "/leaderboard", element: <LeaderBoard /> },
  { path: "/forgotpassword", element: <ForgotPassword/> },
  { path: "/alldownload", element: <Alldownload/> },
]);
export default function RenderPage() {
  return (
    <RouterProvider router={router}>
      <Outlet />
    </RouterProvider>
  );
}
