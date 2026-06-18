'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { Loading } from '@/components/Loading/Loading';
import { ErrorMessage } from '@/components/ErrorMessage/ErrorMessage';
import { parseSearchParams } from '@/lib/search/parseSearchParams';
import {
    loadSearchList,
    loadSearchDetails,
    type SearchDetailsResult,
    type SearchListResult,
} from '@/lib/search/loadSearchResults';
import { buildSearchHref } from '@/lib/search/buildSearchPath';
import { SearchPageToolbar } from './SearchPageToolbar';
import { SearchResultsLayout } from './SearchResultsLayout';
import { SearchResultsListClient } from './SearchResultsListClient';
import { SearchResultsFooter } from './SearchResultsFooter';
import { DetailsPanelShell } from './DetailsPanelShell';
import { CloseDetailsButton } from './CloseDetailsButton';
import { SelectedItemsFlyoutContainer } from './SelectedItemsFlyoutContainer';
import './SearchPage.css';

const detailsCache = new Map<string, SearchDetailsResult>();

function TestDetailsPanel({
    details,
    isLoading,
}: {
    details: SearchDetailsResult | null;
    isLoading: boolean;
}) {
    const t = useTranslations('details');

    if (isLoading) {
        return (
            <section className="details-panel">
                <div className="details-panel__state">
                    <Loading />
                </div>
            </section>
        );
    }

    if (!details || !details.ok) {
        return (
            <section className="details-panel">
                <ErrorMessage message={t('loadError')} />
            </section>
        );
    }

    return (
        <section className="details-panel">
            <article className="details-container">
                <p className="details-label">
                    {t('itemLabel', { id: details.item.id })}
                </p>
                <h2 className="details-title">{details.item.name}</h2>
                <p className="details-text">{details.item.description}</p>
            </article>
        </section>
    );
}

export function SearchPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const t = useTranslations('search');

    const { page, q, detailsId } = parseSearchParams(
        Object.fromEntries(searchParams.entries())
    );

    const [list, setList] = useState<SearchListResult | null>(null);
    const [details, setDetails] = useState<SearchDetailsResult | null>(null);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [listLoading, setListLoading] = useState(true);

    const fetchList = useCallback(async () => {
        setListLoading(true);
        const listResult = await loadSearchList(q, page);
        setList(listResult);
        setListLoading(false);
    }, [page, q]);

    const fetchDetails = useCallback(async () => {
        if (!detailsId) {
            setDetails(null);
            setDetailsLoading(false);
            return;
        }

        const cached = detailsCache.get(detailsId);
        if (cached) {
            setDetails(cached);
            setDetailsLoading(false);
            return;
        }

        setDetailsLoading(true);
        const detailsResult = await loadSearchDetails(detailsId);

        if (detailsResult?.ok) {
            detailsCache.set(detailsId, detailsResult);
        }

        setDetails(detailsResult);
        setDetailsLoading(false);
    }, [detailsId]);

    useEffect(() => {
        if (list?.ok && list.total > 0 && page > list.maxPage) {
            router.push(
                buildSearchHref(pathname, {
                    q,
                    page: list.maxPage,
                    detailsId,
                })
            );
        }
    }, [detailsId, list, page, pathname, q, router]);

    const handleRefresh = useCallback(() => {
        detailsCache.clear();
        fetchList();
        fetchDetails();
    }, [fetchDetails, fetchList]);

    useEffect(() => {
        fetchList();
    }, [fetchList]);

    useEffect(() => {
        fetchDetails();
    }, [fetchDetails]);

    if (!list) {
        return (
            <>
                <SearchPageToolbar
                    q={q}
                    detailsId={detailsId}
                    onRefresh={handleRefresh}
                />
                <div className="results-section panel">
                    <Loading />
                </div>
                <SelectedItemsFlyoutContainer />
            </>
        );
    }

    return (
        <>
            <SearchPageToolbar
                q={q}
                detailsId={detailsId}
                onRefresh={handleRefresh}
            />
            <SearchResultsLayout
                detailsId={detailsId}
                list={
                    <>
                        {listLoading ? (
                            <Loading />
                        ) : !list.ok ? (
                            <ErrorMessage message={t('loadError')} />
                        ) : (
                            <SearchResultsListClient
                                items={list.items}
                                page={page}
                                q={q}
                                detailsId={detailsId}
                            />
                        )}
                        <SearchResultsFooter
                            page={page}
                            q={q}
                            detailsId={detailsId}
                            total={list.ok ? list.total : 0}
                            maxPage={list.ok ? list.maxPage : 1}
                        />
                    </>
                }
                detailsPanel={
                    <>
                        {detailsId && (
                            <CloseDetailsButton page={page} q={q} />
                        )}
                        <DetailsPanelShell detailsId={detailsId}>
                            {detailsId && (
                                <TestDetailsPanel
                                    details={details}
                                    isLoading={detailsLoading}
                                />
                            )}
                        </DetailsPanelShell>
                    </>
                }
            />
            <SelectedItemsFlyoutContainer />
        </>
    );
}
