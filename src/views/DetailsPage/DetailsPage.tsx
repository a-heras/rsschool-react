'use client';

import { useAppDispatch } from '@/store/hooks';
import { searchApi, useGetItemDetailsQuery } from '@/store/searchApi';
import { Loading } from '@/components/Loading/Loading';
import { ErrorMessage } from '@/components/ErrorMessage/ErrorMessage';
import './DetailsPage.css';

interface DetailsPageProps {
    itemId: string;
}

export function DetailsPage({ itemId }: DetailsPageProps) {
    const dispatch = useAppDispatch();

    const { data: item, isLoading, isError } = useGetItemDetailsQuery(itemId, {
        skip: !itemId || itemId === 'undefined',
    });

    const handleRefreshDetails = () => {
        dispatch(searchApi.util.invalidateTags([{ type: 'Item', id: itemId }]));
    };

    if (isLoading) {
        return (
            <section className="details-panel">
                <div className="details-panel__state">
                    <Loading />
                </div>
            </section>
        );
    }

    if (isError) {
        return (
            <section className="details-panel">
                <button
                    type="button"
                    className="btn btn--on-dark details-refresh-btn"
                    onClick={handleRefreshDetails}
                >
                    Refresh
                </button>
                <ErrorMessage message="Failed to load details. Please try again." />
            </section>
        );
    }

    if (!item) return null;

    return (
        <section className="details-panel">
            <button
                type="button"
                className="btn btn--on-dark details-refresh-btn"
                onClick={handleRefreshDetails}
            >
                Refresh
            </button>
            <article className="details-container">
                <p className="details-label">Item #{item.id}</p>
                <h2 className="details-title">{item.name}</h2>
                <p className="details-text">{item.description}</p>
            </article>
        </section>
    );
}
