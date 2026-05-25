import { NavLink } from "react-router-dom";
import "./Header.css";

function navLinkClass({ isActive }: { isActive: boolean }) {
    return isActive ? "nav-link active" : "nav-link";
}

export function Header() {
    return (
        <header className="header">
            <nav className="nav">
                <NavLink to="/" end className={navLinkClass}>
                    Home
                </NavLink>
                <NavLink to="/about" className={navLinkClass}>
                    About
                </NavLink>
            </nav>
        </header>
    );
}
