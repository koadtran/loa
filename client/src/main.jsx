import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router";
import './index.css';
import {AuthProvider} from './context/useAuth';
import Protected from './components/protected/Protected';
import Login from './components/login/Login';
import Signup from './components/signup/Signup';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Protected />,
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
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);