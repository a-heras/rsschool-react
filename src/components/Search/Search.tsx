import { useState, useEffect, type ChangeEvent } from "react";
import "./Search.css";

interface SearchProps {
    onSearch: (term: string) => void;
}

export function Search({onSearch}: SearchProps) {
    const [searchTerm, setSearchTerm] = useState("");
    
    useEffect(() => {
        const saved = localStorage.getItem("searchTerm");
        if(saved) {
            setSearchTerm(saved);
        }
    }, []);
    
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    }

    const handleSearchClick = () => {
        onSearch(searchTerm.trim());
    }

    return (
        <div className="search-container">
            <input
                type="text"
                className="search-input"
                value={searchTerm}
                onChange={handleChange}
                placeholder="Search..."
            />
            <button className="search-button" onClick={handleSearchClick}>Search</button>
        </div>
    );
}