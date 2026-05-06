import { Component, type ReactNode } from "react";

interface ErrorBoundaryState {
  hasError: boolean;
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
        console.error("Application error:", error, info);
        this.setState({ hasError: true });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: "20px", color: "darkred" }}>
                    <h2>Something went wrong.</h2>
                    <p>Please reload the page or try again later.</p>
                </div>
            );
        }

        return this.props.children;
    }
}