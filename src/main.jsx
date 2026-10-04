import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { App } from './App.jsx';
import { RecoveryBoundary } from './RecoveryBoundary.jsx';
import '../assets/style.css';
import '../assets/project-viewer.css';
import '../assets/trinker-terminal.css';
import '../assets/seleno-showcase.css';
import '../assets/qpgen-studio.css';
import '../assets/qpgen-case-study.css';
import '../assets/triya-showcase.css';
import './app.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode><RecoveryBoundary><BrowserRouter><App /></BrowserRouter></RecoveryBoundary></React.StrictMode>,
);
