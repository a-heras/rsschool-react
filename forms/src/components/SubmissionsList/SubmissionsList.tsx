import { useEffect } from 'react';
import { SubmissionCard } from '../SubmissionCard/SubmissionCard';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
    clearLatestHighlight,
    selectLatestSubmissionId,
    selectSubmissions,
} from '../../store/submissionsSlice';
import './SubmissionsList.css';

const HIGHLIGHT_DURATION_MS = 3000;

export function SubmissionsList() {
    const dispatch = useAppDispatch();
    const submissions = useAppSelector(selectSubmissions);
    const latestId = useAppSelector(selectLatestSubmissionId);

    useEffect(() => {
        if (!latestId) return;

        const timer = window.setTimeout(() => {
            dispatch(clearLatestHighlight());
        }, HIGHLIGHT_DURATION_MS);

        return () => window.clearTimeout(timer);
    }, [latestId, dispatch]);

    if (submissions.length === 0) {
        return (
            <p className="submissions-list__empty">
                No submissions yet. Submit a form to see cards here.
            </p>
        );
    }

    return (
        <section className="submissions-list" aria-label="Submitted forms">
            <h2 className="submissions-list__title">Submissions</h2>
            <ul className="submissions-list__grid">
                {submissions.map((submission) => (
                    <li key={submission.id}>
                        <SubmissionCard
                            submission={submission}
                            isLatest={submission.id === latestId}
                        />
                    </li>
                ))}
            </ul>
        </section>
    );
}