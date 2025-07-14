import React from 'react';
import ReactDOM from 'react-dom/client';
import {createBrowserRouter, RouterProvider} from 'react-router-dom'

import './app.css';
import NotFoundPage from './pages/notfound.js';
import HomePage from './pages/home.js';
import LearnPlace from './pages/learnPlace.js';
import AdminPage from './pages/admin.js';
import AdminPageItems from './pages/adminItem.js';

import reportWebVitals from './reportWebVitals.js';

const router = createBrowserRouter([
    {path: '/', element: <HomePage/>},
    {path: '/home', element: <HomePage/>},
    {path: '/learn', element: <LearnPlace/>},
    {path: '/admin', element: <AdminPage/>},
    {path: '/admin/:page', element: <AdminPageItems/>},
    {path: '/notfound', element: <NotFoundPage/>},
    {path: '*', element: <NotFoundPage/>},
])
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    // <React.StrictMode>
    //     <RouterProvider router={router}/>
    // </React.StrictMode>
    <RouterProvider router={router}/>
);
reportWebVitals();