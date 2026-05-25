import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Loading } from './Loading';

describe('Loading component', () => {
    it('renders loading text', () => {
        render(<Loading />);
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
});
