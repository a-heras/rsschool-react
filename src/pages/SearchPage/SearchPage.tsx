import { useEffect } from "react";
import { Outlet, useSearchParams } from "react-router-dom";
import { Search } from "../../components/Search/Search";
import "../../layout/Main/Main.css";
import { CardList } from "../../components/CardList/CardList";
import { Loading } from "../../components/Loading/Loading";
import { ErrorMessage } from "../../components/ErrorMessage/ErrorMessage";
import { ErrorButton } from "../../components/ErrorButton/ErrorButton";
import { Pagination } from "../../components/Pagination/Pagination";
import { ITEMS_PER_PAGE } from "../../config/pagination";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchItems, setSearchTerm, toggleItemSelection } from "../../store/searchSlice";
import "./SearchPage.css";


export function SearchPage() {
    const dispatch = useAppDispatch();
    const { items, total, loading, error, searchTerm } = useAppSelector(
        (state) => state.search
    );
    const [searchParams, setSearchParams] = useSearchParams();
    const detailsId = searchParams.get("details");
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const selectedItems = useAppSelector((state) => state.search.selectedItems);

    useEffect(() => {
        const saved = localStorage.getItem("searchTerm") ?? "";

        if (saved && saved !== searchTerm) {
            dispatch(setSearchTerm(saved));
            return;
        }
    
        dispatch(fetchItems({ term: searchTerm, page }));
    }, [dispatch, searchTerm, page]);

    const handleSearch = (term: string) => {
        const trimmed = term.trim();

        if (trimmed === searchTerm) return;

        dispatch(setSearchTerm(trimmed));

        localStorage.setItem("searchTerm", trimmed);

        setSearchParams({ page: "1" });
    };

    const maxPage = Math.ceil(total / ITEMS_PER_PAGE);

    useEffect(() => {
        if (page > maxPage && maxPage > 0) {
            const params: Record<string, string> = { page: String(maxPage) };
            if (detailsId) {
                params.details = detailsId;
            }
            setSearchParams(params);
        }
    }, [page, maxPage, detailsId, setSearchParams]);

    const openDetails = (id: string) => {
        if (!id || id === "undefined") return;

        setSearchParams({ page: String(page), details: id });
    };

    const closeDetails = () => {
        setSearchParams({ page: String(page) });
    };

    const handlePageChange = (newPage: number) => {
        if (detailsId) {
            setSearchParams({ page: String(newPage), details: detailsId });
        } else {
            setSearchParams({ page: String(newPage) });
        }
    };

    return (
        <>
            <div className="top-controls">
                <Search savedTerm={searchTerm} onSearch={handleSearch} />
            </div>

            <div className="results-section">
                <div className={detailsId ? "split split--open" : "split"}>
                    <div className="split-left">
                        {error ? (
                            <ErrorMessage message={error} />
                        ) : loading ? (
                            <Loading />
                        ) : (
                            <CardList
                                items={items}
                                selectedItems={selectedItems}
                                onToggleSelect={(item) => dispatch(toggleItemSelection(item))}
                                onOpenDetails={openDetails}
                            />
                        )}

                        {!loading && !error && total > 0 && (
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
                                className="close-btn"
                                onClick={closeDetails}
                                aria-label="Close details"
                            >
                                ×
                            </button>
                            <Outlet />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}