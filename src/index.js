import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { ServerConnectionProvider } from './contexts/ConnectedServerContext';
import { AuthProvider } from './contexts/AuthContext';
import ErrorPage from './pages/ErrorPage';
import UserSelectionPage from './pages/UserSelectionPage';
import LandingPage from './pages/LandingPage';
import ServerSelectionPage from './pages/ServerSelectionPage';


const router = createBrowserRouter([
  {
    path:"/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path:"/users/register",
        element: <UserSelectionPage action="register" />
      },
      {
        path:"/users/login",
        element: <UserSelectionPage action="login" />
      },
      {
        path:"/landing",
        element: <LandingPage />
      },
      {
        path:"/servers/select",
        element: <ServerSelectionPage />
      }
    ]
  },
  
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ServerConnectionProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ServerConnectionProvider>
    
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
