import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { App } from './App.jsx';
import { RecoveryBoundary } from './RecoveryBoundary.jsx';


createRoot(document.getElementById('root')).render(
  <React.StrictMode><RecoveryBoundary><BrowserRouter><App /></BrowserRouter></RecoveryBoundary></React.StrictMode>,
);
