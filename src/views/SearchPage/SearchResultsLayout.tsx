import type { ReactNode } from 'react';
import './SearchPage.css';

type SearchResultsLayoutProps = {
    detailsId: string | null;
    list: ReactNode;
    detailsPanel: ReactNode;
};

export function SearchResultsLayout({
    detailsId,
    list,
    detailsPanel,
}: SearchResultsLayoutProps) {
    return (
        <div className="results-section panel">
            <div className="results-section__body">
                <div className={detailsId ? 'split split--open' : 'split'}>
                    <div className="split-left">{list}</div>
                    <div className="split-right">{detailsPanel}</div>
                </div>
            </div>
        </div>
    );
}
