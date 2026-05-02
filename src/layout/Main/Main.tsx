import { Component, type ReactNode } from "react";
import "./Main.css";

interface MainProps {
    search: ReactNode;
    results: ReactNode;
}

export class Main extends Component<MainProps> {
    render() {
        return (
        <div className="main-container">
            <div className="top-controls">
                {this.props.search}
            </div>

            <div className="results-section">
                {this.props.results}
            </div>
        </div>
        );
    }
}