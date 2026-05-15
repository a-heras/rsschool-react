import { useState, useEffect } from "react";
import { Main } from "../layout/Main/Main";
import { Search } from "../components/Search/Search";
import { CardList } from "../components/CardList/CardList";
import { type Item } from "../types/item";
import { loadData } from "../api/api";
import { Loading } from "../components/Loading/Loading";
import { ErrorMessage } from "../components/ErrorMessage/ErrorMessage";
import { ErrorButton } from "../components/ErrorButton/ErrorButton";
import { useSearchParams } from "react-router-dom";
import { Pagination } from "../components/Pagination/Pagination";
import { ITEMS_PER_PAGE } from "../config/pagination";

export function SearchPage() {
    const [items, setItems] = useState<Item[]>([]);
    const [lastSearchTerm, setLastSearchTerm] = useState(() => localStorage.getItem("searchTerm") || "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const page = Number(searchParams.get("page") || 1);
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
    }

    const maxPage = Math.ceil(total / ITEMS_PER_PAGE);

    useEffect(() => {
        if (page > maxPage && maxPage > 0) {
            setSearchParams({ page: String(maxPage) });
        }
    }, [page, maxPage]);

    return (
        <Main
            search={<Search onSearch={handleSearch} />}
            results={
                <div>
                    {error ? (
                        <ErrorMessage message={error} />
                    ) : loading ? (
                        <Loading />
                    ) : (
                        <CardList items={items} />
                    )}

                    {!loading && !error && maxPage > 1 && (
                        <Pagination
                            page={page}
                            maxPage={maxPage}
                            onPageChange={(newPage) => setSearchParams({ page: String(newPage) })}
                        />
                    )}

                    <div>
                        <ErrorButton />
                    </div>
                </div>
            }
        />
    );
}