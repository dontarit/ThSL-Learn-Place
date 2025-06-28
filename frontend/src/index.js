import React from 'react';
import ReactDOM from 'react-dom/client';

import './app.css';
import NotFoundPage from './pages/notfound.js';
import HomePage from './pages/homepage.js';
import LearnPlace from './pages/learnPlace.js';
import LoginTest from './pages/loginTest.js';
import reportWebVitals from './reportWebVitals.js';
import {createBrowserRouter, RouterProvider} from 'react-router-dom'

const router = createBrowserRouter([
    {path: '/', element: <HomePage/>},
    {path: '/learn', element: <LearnPlace/>},
    {path: '/login', element: <LoginTest/>},
    {path: '*', element: <NotFoundPage/>}
])
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <React.StrictMode>
        <RouterProvider router={router}/>
    </React.StrictMode>
);
reportWebVitals();