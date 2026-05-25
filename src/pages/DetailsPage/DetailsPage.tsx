import { useEffect, useState } from 'react';
import { loadDetails } from '../../api/api';
import { type Item } from '../../types/item';
import { Loading } from '../../components/Loading/Loading';
import { ErrorMessage } from '../../components/ErrorMessage/ErrorMessage';
import './DetailsPage.css';

interface DetailsPageProps {
    itemId: string;
}

export function DetailsPage({ itemId }: DetailsPageProps) {
    const [item, setItem] = useState<Item | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadDetails(itemId)
            .then((data) => {
                setItem(data);
                setLoading(false);
            })
            .catch(() => {
                setError('Failed to load details.');
                setLoading(false);
            });
    }, [itemId]);

    if (loading) {
        return (
            <section className="details-panel">
                <div className="details-panel__state">
                    <Loading />
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="details-panel">
                <ErrorMessage message={error} />
            </section>
        );
    }

    if (!item) return null;

    return (
        <section className="details-panel">
            <article className="details-container">
                <p className="details-label">Item #{item.id}</p>
                <h2 className="details-title">{item.name}</h2>
                <p className="details-text">{item.description}</p>
            </article>
        </section>
    );
}
