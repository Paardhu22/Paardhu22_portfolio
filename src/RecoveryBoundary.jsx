import { Component } from 'react';

export class RecoveryBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error, info) {
    console.error('Portfolio could not render:', error, info.componentStack);
  }

  render() {
    if (this.state.failed) return <main className="startup-fallback">
      <h1>Paardhiv Reddy<span className="name-dot">.</span></h1>
      <p>Something didn’t open correctly. Please try again.</p>
      <button type="button" onClick={() => window.location.reload()}>Try again</button>
    </main>;
    return this.props.children;
  }
}
