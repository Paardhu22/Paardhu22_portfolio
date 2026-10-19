import '../assets/style.css';
import '../assets/project-viewer.css';
import '../assets/trinker-terminal.css';
import '../assets/seleno-showcase.css';
import '../assets/qpgen-studio.css';
import '../assets/qpgen-case-study.css';
import '../assets/triya-showcase.css';
import './app.css';

// Keep startup recoverable even if a cached or interrupted module fails to load.
import('./main.jsx').catch(error => window.reportPortfolioStartupError?.(error));
