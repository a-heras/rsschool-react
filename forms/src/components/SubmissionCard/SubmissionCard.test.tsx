import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { FormSubmission } from '../../types/form';
import { SubmissionCard } from './SubmissionCard';

const submission: FormSubmission = {
    id: '1',
    formType: 'uncontrolled',
    name: 'Anna',
    age: 25,
    email: 'anna@mail.com',
    gender: 'female',
    termsAccepted: true,
    imageBase64: 'data:image/png;base64,abc',
    country: 'Belarus',
    submittedAt: '2026-06-08T10:00:00.000Z',
};

describe('SubmissionCard', () => {
    it('renders submission details with image', () => {
        render(<SubmissionCard submission={submission} isLatest />);

        expect(screen.getByRole('article')).toHaveClass('submission-card--latest');
        expect(screen.getByText('Anna')).toBeInTheDocument();
        expect(screen.getByText('Uncontrolled Form')).toBeInTheDocument();
        expect(screen.getByAltText('Anna profile')).toBeInTheDocument();
        expect(screen.getByText('Belarus')).toBeInTheDocument();
    });

    it('renders placeholder when image is missing', () => {
        render(
            <SubmissionCard
                submission={{ ...submission, imageBase64: '', formType: 'react-hook-form' }}
                isLatest={false}
            />
        );

        expect(screen.getByText('No image')).toBeInTheDocument();
        expect(screen.getByText('React Hook Form')).toBeInTheDocument();
    });
});
