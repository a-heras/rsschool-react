import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { NextIntlClientProvider } from 'next-intl';
import { ErrorBoundary } from './ErrorBoundary';
import enMessages from '../../messages/en.json';

const Boom = () => {
    throw new Error('Boom');
};

describe('ErrorBoundary', () => {
    it('renders children when no error occurs', () => {
        render(
            <NextIntlClientProvider locale="en" messages={enMessages}>
                <ErrorBoundary>
                    <div>OK</div>
                </ErrorBoundary>
            </NextIntlClientProvider>
        );

        expect(screen.getByText('OK')).toBeInTheDocument();
    });

    it('catches errors and shows fallback UI', () => {
        const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

        render(
            <NextIntlClientProvider locale="en" messages={enMessages}>
                <ErrorBoundary>
                    <Boom />
                </ErrorBoundary>
            </NextIntlClientProvider>
        );

        expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
        expect(
            screen.getByText('Please reload the page or try again later.')
        ).toBeInTheDocument();

        spy.mockRestore();
    });
});
