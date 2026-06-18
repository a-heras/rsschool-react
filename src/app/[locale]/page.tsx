import { setRequestLocale } from 'next-intl/server';
import { redirect } from '@/i18n/navigation';
import { parseSearchParams } from '@/lib/search/parseSearchParams';
import {
    loadSearchList,
    loadSearchDetails,
} from '@/lib/search/loadSearchResults';
import { buildSearchHref } from '@/lib/search/buildSearchPath';
import { SearchPageToolbar } from '@/views/SearchPage/SearchPageToolbar';
import { SearchResultsSection } from '@/views/SearchPage/SearchResultsSection';
import { SearchResultsFooter } from '@/views/SearchPage/SearchResultsFooter';
import { SelectedItemsFlyoutContainer } from '@/views/SearchPage/SelectedItemsFlyoutContainer';

type PageProps = {
    params: Promise<{ locale: string }>;
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function HomePage({ params, searchParams }: PageProps) {
    const { locale } = await params;
    setRequestLocale(locale);

    const { page, q, detailsId } = parseSearchParams(await searchParams);

    const [list, details] = await Promise.all([
        loadSearchList(q, page),
        loadSearchDetails(detailsId),
    ]);

    if (list.ok && list.total > 0 && page > list.maxPage) {
        redirect({
            href: buildSearchHref('/', {
                q,
                page: list.maxPage,
                detailsId,
            }),
            locale,
        });
    }

    return (
        <>
            <SearchPageToolbar q={q} detailsId={detailsId} />
            <SearchResultsSection
                list={list}
                details={details}
                page={page}
                q={q}
                detailsId={detailsId}
                footer={
                    <SearchResultsFooter
                        page={page}
                        q={q}
                        detailsId={detailsId}
                        total={list.ok ? list.total : 0}
                        maxPage={list.ok ? list.maxPage : 1}
                    />
                }
            />
            <SelectedItemsFlyoutContainer />
        </>
    );
}
