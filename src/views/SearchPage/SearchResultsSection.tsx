import type { ReactNode } from 'react';
import { SearchResultsLayout } from './SearchResultsLayout';
import { SearchResultsList } from './SearchResultsList';
import { DetailsPanelShell } from './DetailsPanelShell';
import { SearchDetailsPanel } from './SearchDetailsPanel';
import { SearchResultsListClient } from './SearchResultsListClient';
import { CloseDetailsButton } from './CloseDetailsButton';
import type { SearchDetailsResult, SearchListResult } from '@/lib/search/loadSearchResults';

type SearchResultsSectionProps = {
    list: SearchListResult;
    details: SearchDetailsResult | null;
    page: number;
    q: string;
    detailsId: string | null;
    footer: ReactNode;
};

export async function SearchResultsSection({
    list,
    details,
    page,
    q,
    detailsId,
    footer,
}: SearchResultsSectionProps) {
    const detailsPanel =
        detailsId && details ? (
            <SearchDetailsPanel details={details} />
        ) : null;

    return (
        <SearchResultsLayout
            detailsId={detailsId}
            list={
                <>
                    <div className="results-list-stack">
                        <div className="results-list-server">
                            <SearchResultsList list={list} />
                        </div>
                        {list.ok && (
                            <div className="results-list-client">
                                <SearchResultsListClient
                                    items={list.items}
                                    page={page}
                                    q={q}
                                    detailsId={detailsId}
                                />
                            </div>
                        )}
                    </div>
                    {footer}
                </>
            }
            detailsPanel={
                <>
                    {detailsId && <CloseDetailsButton page={page} q={q} />}
                    <DetailsPanelShell detailsId={detailsId}>
                        {detailsPanel}
                    </DetailsPanelShell>
                </>
            }
        />
    );
}
