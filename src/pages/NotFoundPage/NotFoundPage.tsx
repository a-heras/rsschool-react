import "./NotFoundPage.css";
import { Link } from "react-router-dom";

export function NotFoundPage() {
    return (
        <section className="notfound">
            <h1 className="notfound-title">404 — Page Not Found</h1>

            <p className="notfound-text">
                The page you are looking for does not exist.
            </p>

            <Link className="notfound-link" to="/">
                Go Home
            </Link>
        </section>
    );
}