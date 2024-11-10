import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import React from 'react';
import HomePage from './pages/HomePage/HomePage.jsx';
import GoalsPage from './pages/GoalsPage/GoalsPage.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/goals',
    element: <GoalsPage/ >
  }
])

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)