import { Component, ReactNode } from "react";
import "./Main.css";

interface MainProps {
    search: ReactNode;
    results: ReactNode;
}

export class Main extends Component<MainProps> {
    render() {
        const {search, results} = this.props;
        return (
            <div className="main-layout">
                <section className="search-section">
                    {search}
                </section>
                <section className="result-section">
                    {results}
                </section>
            </div>
        );
    }    
}