import React from 'react';
import ReactDOM from 'react-dom/client';

import './app.css';
import NotFoundPage from './pages/notfound.js';
import HomePage from './pages/home.js';
import LearnPlace from './pages/learnPlace.js';
import LoginTest from './pages/loginTest.js';
import AdminPage from './pages/admin.js';
import AdminCreate from './pages/admin/create.js';

import reportWebVitals from './reportWebVitals.js';
import {createBrowserRouter, RouterProvider} from 'react-router-dom'

const router = createBrowserRouter([
    {path: '/home', element: <HomePage/>},
    {path: '/learn', element: <LearnPlace/>},
    {path: '/login', element: <LoginTest/>},
    {path: '/admin', element: <AdminPage/>},
    {path: '/admin/create', element: <AdminCreate/>},
    {path: '/admin/user', element: <AdminPage/>},
    {path: '/admin/thsl', element: <AdminPage/>},
    {path: '*', element: <NotFoundPage/>}
])
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    // <React.StrictMode>
    //     <RouterProvider router={router}/>
    // </React.StrictMode>
    <RouterProvider router={router}/>
);
reportWebVitals();