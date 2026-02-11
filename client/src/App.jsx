import React from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";

import HeroSection from "./pages/HeroSection";
import About from "./pages/About";
import Project from "./pages/Project";
import Blog from "./pages/Blog";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import BlogForm from "./pages/BlogForm";
import MainLayout from "./Layout/MainLayout";
import NotFound from "./pages/NotFound";

// Component that conditionally redirects based on screen size
function RootRedirect() {
  const isMobile = window.innerWidth < 768; // Tailwind's md breakpoint
  return <Navigate to={isMobile ? "/hero" : "/about"} replace />;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      // Root route now uses RootRedirect
      { index: true, element: <RootRedirect /> },

      { path: "hero", element: <HeroSection /> },
      { path: "about", element: <About /> },
      { path: "projects", element: <Project /> },
      { path: "blog", element: <Blog /> },
      { path: "services", element: <Services /> },
      { path: "contact", element: <Contact /> },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/admin/dashboard",
    element: <AdminDashboard />,
  },
  {
    path: "/admin/create-blog",
    element: <BlogForm />,
  },
  {
    path: "/admin/edit-blog/:id",
    element: <BlogForm />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
