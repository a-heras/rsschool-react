import { useState, useEffect } from "react";
import { Main } from "../layout/Main/Main";
import { Search } from "../components/Search/Search";
import { CardList } from "../components/CardList/CardList";
import { type Item } from "../types/item";
import { loadData } from "../api/api";
import { Loading } from "../components/Loading/Loading";
import { ErrorMessage } from "../components/ErrorMessage/ErrorMessage";
import { ErrorButton } from "../components/ErrorButton/ErrorButton";

export function SearchPage() {
    const [items, setItems] = useState<Item[]>([]);
    const [lastSearchTerm, setLastSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const saved = localStorage.getItem("searchTerm") || "";

        if (saved === "") return;

        setLoading(true);
        setError(null);

        loadData(saved)
            .then((items) => {
                setItems(items);
                setLastSearchTerm(saved);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
                setError("Failed to load data. Please try again.");
            });
        }, []);
    
    const handleSearch = (term: string) => {
        const trimmed = term.trim();

        if (trimmed === lastSearchTerm) return;

        setLoading(true);
        setError(null);
        localStorage.setItem("searchTerm", trimmed);

        loadData(trimmed)
            .then((items) => {
                setItems(items);
                setLastSearchTerm(trimmed);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
                setError("Failed to load data. Please try again.");
            });
        };
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

                    <div>
                        <ErrorButton />
                    </div>
                </div>
            }
        />
    );
}