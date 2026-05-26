import { useGetItemDetailsQuery } from '../../store/searchApi';
import { Loading } from '../../components/Loading/Loading';
import { ErrorMessage } from '../../components/ErrorMessage/ErrorMessage';
import './DetailsPage.css';

interface DetailsPageProps {
    itemId: string;
}

export function DetailsPage({ itemId }: DetailsPageProps) {
    const { data: item, isLoading, isError } = useGetItemDetailsQuery(itemId, {
        skip: !itemId || itemId === 'undefined',
    });

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
                <ErrorMessage message="Failed to load details. Please try again." />
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
