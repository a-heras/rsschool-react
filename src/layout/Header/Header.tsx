import { NavLink } from "react-router-dom";
import "./Header.css";

export function Header() {
    return (
        <header className="header">
            <nav className="nav">
                <NavLink to="/">Home</NavLink>
                <NavLink to="/about">About</NavLink>
            </nav>
        </header>
    );
}