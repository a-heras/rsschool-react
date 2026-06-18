'use client';

import { Component, type ReactNode } from 'react';
import { ErrorFallback } from './ErrorFallback';

interface ErrorBoundaryState {
    hasError: boolean;
}

interface ErrorBoundaryProps {
    children: ReactNode;
}

export class ErrorBoundary extends Component<
    ErrorBoundaryProps,
    ErrorBoundaryState
> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
        console.error('Application error:', error, info);
        this.setState({ hasError: true });
    }

    render() {
        if (this.state.hasError) {
            return <ErrorFallback />;
        }

        return this.props.children;
    }
}
