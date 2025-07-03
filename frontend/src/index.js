import React from 'react';
import ReactDOM from 'react-dom/client';

import './app.css';
import NotFoundPage from './pages/notfound.js';
import HomePage from './pages/homepage.js';
import LearnPlace from './pages/learnPlace.js';
import LoginTest from './pages/loginTest.js';
import AdminPage from './pages/adminpage.js';
import reportWebVitals from './reportWebVitals.js';
import {createBrowserRouter, RouterProvider} from 'react-router-dom'

const router = createBrowserRouter([
    {path: '/', element: <HomePage/>},
    {path: '/learn', element: <LearnPlace/>},
    {path: '/login', element: <LoginTest/>},
    {path: '/dashboard', element: <AdminPage/>},
    // {path: '/dashboard/:path', element: <AdminItems/>},
    {path: '*', element: <NotFoundPage/>}
])
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <React.StrictMode>
        <RouterProvider router={router}/>
    </React.StrictMode>
);
reportWebVitals();