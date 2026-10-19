import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { App } from './App.jsx';

// Uses the same components as the browser, with no browser or network at build time.
export function render(path) {
  return renderToString(<StaticRouter location={path}><App /></StaticRouter>);
}
