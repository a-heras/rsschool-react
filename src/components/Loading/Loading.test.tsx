import { screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Loading } from './Loading';
import { renderWithIntl } from '@/test-utils/renderWithIntl';

describe('Loading component', () => {
    it('renders loading text', () => {
        renderWithIntl(<Loading />);
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
});
