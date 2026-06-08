import type { FormSubmission } from '../../types/form';
import './SubmissionCard.css';

type SubmissionCardProps = {
    submission: FormSubmission;
    isLatest: boolean;
};

const formTypeLabels: Record<FormSubmission['formType'], string> = {
    'uncontrolled': 'Uncontrolled Form',
    'react-hook-form': 'React Hook Form',
}

export function SubmissionCard({ submission, isLatest }: SubmissionCardProps) {
    return (
        <article
            className={`submission-card ${isLatest ? 'submission-card--latest' : ''}`}
        >
            <header className="submission-card__header">
                <h2 className="submission-card__title">{submission.name}</h2>
                <span className="submission-card__type">
                    {formTypeLabels[submission.formType]}
                </span>
            </header>

            {submission.imageBase64 ? (
                <img
                    className="submission-card__image"
                    src={submission.imageBase64}
                    alt={`${submission.name} profile`}
                />
            ) : (
                <div className="submission-card__image-placeholder">
                    No image
                </div>
            )}

            <dl className="submission-card__details">
                <div>
                    <dt>Age</dt>
                    <dd>{submission.age}</dd>
                </div>
                <div>
                    <dt>Email</dt>
                    <dd>{submission.email}</dd>
                </div>
                <div>
                    <dt>Gender</dt>
                    <dd>{submission.gender}</dd>
                </div>
                <div>
                    <dt>Country</dt>
                    <dd>{submission.country}</dd>
                </div>
            </dl>
        </article>
    );
}