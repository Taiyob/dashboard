import { createBrowserRouter, Navigate } from "react-router";
import Dashboard from "@/pages/Dashboard/Dashboard";
import DashboardLayout from "@/layout/dashboard-layout";
import Users from "@/pages/Users/Users";
import LoginPage from "@/pages/Login/LoginPage";
import Clients from "@/pages/Clients/Clients";
import Epmloyees from "@/pages/Epmloyees/Epmloyees";
import Courses from "@/pages/Course/Courses";
import Category from "@/pages/Category/Category";
import Product from "@/pages/Product/Product";
import { ProtectedRoute } from "@/layout/protected-route";
import { PublicRoute } from "@/layout/public-route";

const router = createBrowserRouter([
  {
    path: "/",
    children: [
      {
        index: true,
        element: (
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        ),
      },
      {
        path: "/login",
        element: (
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        ),
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "users",
        element: <Users />,
      },
      {
        path: "categories",
        element: <Category />,
      },
      {
        path: "products",
        element: <Product />,
      },
      {
        path: "clients",
        element: <Clients />,
      },
      {
        path: "employees",
        element: <Epmloyees />,
      },
      {
        path: "courses",
        element: <Courses />,
      },
      {
        path: "*",
        element: <Navigate to="/dashboard" replace />,
      },
    ],
  },
]);

export default router;
