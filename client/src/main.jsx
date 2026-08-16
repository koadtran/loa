import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router";
import './index.css'
import Feed from './components/feed/Feed';
import Login from './components/login/Login';
import Signup from './components/signup/Signup';

const router = createBrowserRouter([
  {
    path: "/feed",
    element: <Feed />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);