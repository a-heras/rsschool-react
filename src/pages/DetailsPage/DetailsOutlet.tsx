import { useSearchParams } from 'react-router-dom';
import { DetailsPage } from './DetailsPage';

export function DetailsOutlet() {
    const [searchParams] = useSearchParams();
    const detailsId = searchParams.get('details');

    if (!detailsId || detailsId === 'undefined') {
        return null;
    }

    return <DetailsPage key={detailsId} itemId={detailsId} />;
}
