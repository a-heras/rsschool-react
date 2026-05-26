import { useEffect } from 'react';
import { Outlet, useSearchParams } from 'react-router-dom';
import { Search } from '../../components/Search/Search';
import { CardList } from '../../components/CardList/CardList';
import { Loading } from '../../components/Loading/Loading';
import { ErrorMessage } from '../../components/ErrorMessage/ErrorMessage';
import { ErrorButton } from '../../components/ErrorButton/ErrorButton';
import { Pagination } from '../../components/Pagination/Pagination';
import { ITEMS_PER_PAGE } from '../../config/pagination';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
    setSearchTerm,
    toggleItemSelection,
    clearSelectedItems,
} from '../../store/searchSlice';
import { searchApi, useGetItemsQuery } from '../../store/searchApi';
import { SelectedItemsFlyout } from '../../components/SelectedItemsFlyout/SelectedItemsFlyout';
import { downloadSelectedItemsCsv } from '../../utils/downloadSelectedItemsCsv';
import './SearchPage.css';

export function SearchPage() {
    const dispatch = useAppDispatch();
    const [searchParams, setSearchParams] = useSearchParams();
    const detailsId = searchParams.get('details');
    const page = Math.max(1, Number(searchParams.get('page')) || 1);

    const searchTerm = useAppSelector((state) => state.search.searchTerm);
    const selectedItems = useAppSelector((state) => state.search.selectedItems);
   
    const { data, isLoading, isError } = useGetItemsQuery({
        term: searchTerm,
        page,
    });

    const items = data?.items ?? [];
    const total = data?.total ?? 0;
    const maxPage = Math.ceil(total / ITEMS_PER_PAGE);

    useEffect(() => {
        const saved = localStorage.getItem('searchTerm') ?? '';
        if (saved && saved !== searchTerm) {
            dispatch(setSearchTerm(saved));
        }
    }, [dispatch, searchTerm]);

    const handleSearch = (term: string) => {
        const trimmed = term.trim();

        if (trimmed === searchTerm) return;

        dispatch(setSearchTerm(trimmed));

        localStorage.setItem('searchTerm', trimmed);

        setSearchParams({ page: '1' });
    };

    useEffect(() => {
        if (page > maxPage && maxPage > 0) {
            const params: Record<string, string> = { page: String(maxPage) };
            if (detailsId) {
                params.details = detailsId;
            }
            setSearchParams(params);
        }
    }, [page, maxPage, detailsId, setSearchParams]);

    const closeDetails = () => {
        setSearchParams({ page: String(page) });
    };

    const openDetails = (id: string) => {
        if (!id || id === 'undefined') return;

        if (detailsId === id) {
            closeDetails();
            return;
        }

        setSearchParams({ page: String(page), details: id });
    };

    const handleDownload = () => {
        downloadSelectedItemsCsv(selectedItems, window.location.origin);
    };

    const handlePageChange = (newPage: number) => {
        if (detailsId) {
            setSearchParams({ page: String(newPage), details: detailsId });
        } else {
            setSearchParams({ page: String(newPage) });
        }
    };

    const handleRefreshList = () => {
        dispatch(
            searchApi.util.invalidateTags([
                { type: 'Items', id: 'LIST' },
                { type: 'Items', id: `${searchTerm}-${page}` },
            ])
        );
    };

    return (
        <>
            <div className="top-controls">
                <Search
                    key={searchTerm}
                    savedTerm={searchTerm}
                    onSearch={handleSearch}
                />
                <button
                    type="button"
                    className="btn btn--on-dark"
                    onClick={handleRefreshList}
                    aria-label="Refresh search results"
                >
                    Refresh
                </button>
            </div>

            <div className="results-section panel">
                <div className="results-section__body">
                    <div className={detailsId ? 'split split--open' : 'split'}>
                        <div className="split-left">
                            {isError ? (
                                <ErrorMessage message="Failed to load data. Please try again." />
                            ) : isLoading ? (
                                <Loading />
                            ) : (
                                <CardList
                                    items={items}
                                    selectedItems={selectedItems}
                                    onToggleSelect={(item) =>
                                        dispatch(toggleItemSelection(item))
                                    }
                                    onOpenDetails={openDetails}
                                />
                            )}

                            {!isLoading && !isError && total > 0 && (
                                <Pagination
                                    page={page}
                                    maxPage={maxPage}
                                    onPageChange={handlePageChange}
                                />
                            )}
                            <ErrorButton />
                        </div>
                        {detailsId && (
                            <div className="split-right">
                                <button
                                    type="button"
                                    className="btn btn--on-dark close-btn"
                                    onClick={closeDetails}
                                    aria-label="Close details"
                                >
                                    <span aria-hidden="true">×</span>
                                </button>
                                <Outlet />
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <SelectedItemsFlyout
                count={selectedItems.length}
                onUnselectAll={() => dispatch(clearSelectedItems())}
                onDownload={handleDownload}
            />
        </>
    );
}
