import React from 'react';
import ReactDOM from 'react-dom/client';

import './app.css';
import LearnPlace from './pages/learnPlace.js';
import HomePage from './pages/homepage.js';
import reportWebVitals from './reportWebVitals.js';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <LearnPlace/>
    </React.StrictMode>
);
reportWebVitals();