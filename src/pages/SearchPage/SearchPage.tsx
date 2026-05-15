import { useState, useEffect } from "react";
import { Outlet, useSearchParams } from "react-router-dom";
import { Main } from "../../layout/Main/Main";
import { Search } from "../../components/Search/Search";
import { CardList } from "../../components/CardList/CardList";
import { type Item } from "../../types/item";
import { loadData } from "../../api/api";
import { Loading } from "../../components/Loading/Loading";
import { ErrorMessage } from "../../components/ErrorMessage/ErrorMessage";
import { ErrorButton } from "../../components/ErrorButton/ErrorButton";
import { Pagination } from "../../components/Pagination/Pagination";
import { ITEMS_PER_PAGE } from "../../config/pagination";
import "./SearchPage.css";

export function SearchPage() {
    const [items, setItems] = useState<Item[]>([]);
    const [lastSearchTerm, setLastSearchTerm] = useState(
        () => localStorage.getItem("searchTerm") || ""
    );
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const detailsId = searchParams.get("details");
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        setLoading(true);
        setError(null);

        loadData(lastSearchTerm, page)
            .then(({ items, total }) => {
                setItems(items);
                setTotal(total);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
                setError("Failed to load data. Please try again.");
            });
    }, [page, lastSearchTerm]);

    const handleSearch = (term: string) => {
        const trimmed = term.trim();

        if (trimmed === lastSearchTerm) return;

        localStorage.setItem("searchTerm", trimmed);
        setLastSearchTerm(trimmed);

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
        <Main
            search={<Search onSearch={handleSearch} />}
            results={
                <div className={detailsId ? "split split--open" : "split"}>
                    <div className="split-left">
                        {error ? (
                            <ErrorMessage message={error} />
                        ) : loading ? (
                            <Loading />
                        ) : (
                            <CardList items={items} onItemClick={openDetails} />
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
            }
        />
    );
}