import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router";
import './index.css';
import {AuthProvider} from './context/useAuth';
import Protected from './components/protected/Protected';
import Login from './components/login/Login';
import Signup from './components/signup/Signup';
import Feed from './components/feed/Feed';
import People from './components/people/People';
import Messages from './components/messages/Messages';
import Chat from './components/chat/Chat';
import User from './components/user/User';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Protected />,
    children: [
      {index: true, element: <Feed />},
      {path: 'feed', element: <Feed />},
      {path: 'people', element: <People />},
      {
        path: 'messages',
        element: <Messages />,
        children: [
          {index: true, element: <div style={{'width': '100%', 'height': '100%', 'display': 'flex', 'flex-direction': 'column', 'align-items': 'center', 'justify-content': 'center'}}>
                                    <p style={{'color': 'var(--color-text-muted)', 'font-size': 'var(--text-xl)'}}>
                                      Select a conversation to start chatting
                                    </p>
                                  </div>},
          {path: ':id', element: <Chat />},
        ]
      },
      {path: 'user', element: <User />},
      {path: 'user/:username', element: <User />},
    ],
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

