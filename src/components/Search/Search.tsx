import { useState, useEffect, type ChangeEvent } from "react";
import "./Search.css";

interface SearchProps {
    onSearch: (term: string) => void;
    savedTerm?: string;
}

export function Search({ onSearch, savedTerm = "" }: SearchProps) {
    const [searchTerm, setSearchTerm] = useState(savedTerm);

    useEffect(() => {
        setSearchTerm(savedTerm);
    }, [savedTerm]);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleSearchClick = () => {
        onSearch(searchTerm.trim());
    };

    return (
        <div className="search-container">
            <input
                type="text"
                className="search-input"
                value={searchTerm}
                onChange={handleChange}
                placeholder="Search..."
            />
            <button type="button" className="btn" onClick={handleSearchClick}>
                Search
            </button>
        </div>
    );
}