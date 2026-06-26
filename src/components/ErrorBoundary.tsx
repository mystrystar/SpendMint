import { Component, ErrorInfo, ReactNode } from "react";
import { Card } from "./ui/Card";

export class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Card>
          <h1 className="text-xl font-bold text-slate-900">Something slipped.</h1>
          <p className="mt-2 text-sm text-slate-600">Refresh the page and Vaultwise will restore from the local cache.</p>
        </Card>
      );
    }
    return this.props.children;
  }
}
