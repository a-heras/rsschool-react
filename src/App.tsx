import { Component } from "react";
import { ErrorBoundary } from "./error-boundary/ErrorBoundary";
import { SearchPage } from "./pages/SearchPage";

export class App extends Component {
    render() {
        return (
            <ErrorBoundary>
                 <SearchPage />
            </ErrorBoundary>
        );
    }
}

export default App;