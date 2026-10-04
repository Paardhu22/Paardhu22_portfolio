// Keep startup recoverable even if a cached or interrupted module fails to load.
import('./main.jsx').catch(error => window.reportPortfolioStartupError?.(error));
