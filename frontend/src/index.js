import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './app.css';
import './assets/font/font.css';
import './css/sub/alert_box.css';

import NotFoundPage from './pages/notfound.js';
import HomePage from './pages/home.js';
import LearnPlace from './pages/learnPlace.js';
import LearnPlaceItems from './pages/learnPlaceItem.js';
import LearnPlaceItemInfo from './pages/learnPlaceItemInfo.js';
import CameraTranslate from './pages/camera.js';
import AdminPage from './pages/admin.js';
import AdminPageItems from './pages/adminItem.js';
import PredictionComponent from './pages/model.js';

import ErrorBoundary from './pages/page_utility/errorBound.js';
import ErrorFallback from './pages/page_utility/errorFeed.js';

// import reportWebVitals from './reportWebVitals.js';

const router = createBrowserRouter([
    { path: '', element: <HomePage/>, errorElement: <ErrorFallback/> },
    { path: '/', element: <HomePage/>, errorElement: <ErrorFallback/> },
    { path: '/home', element: <HomePage/>, errorElement: <ErrorFallback/> },
    { path: '/learn', element: <LearnPlace/>, errorElement: <ErrorFallback/> },
    { path: '/learn/search/:word', element: <LearnPlaceItems/>, errorElement: <ErrorFallback/> },
    { path: '/learn/info/:word', element: <LearnPlaceItemInfo/>, errorElement: <ErrorFallback/> },
    { path: '/camera', element: <CameraTranslate/>, errorElement: <ErrorFallback/> },
    { path: '/admin', element: <AdminPage/>, errorElement: <ErrorFallback/> },
    { path: '/admin/:page', element: <AdminPageItems/>, errorElement: <ErrorFallback/> },
    { path: '/testModel', element: <PredictionComponent/>, errorElement: <ErrorFallback/> },
    { path: '*', element: <NotFoundPage/>},
]);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <React.StrictMode>
        <ErrorBoundary>
            <RouterProvider router={router}/>
        </ErrorBoundary>
    </React.StrictMode>
);
// reportWebVitals();