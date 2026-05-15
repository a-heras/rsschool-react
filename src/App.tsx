import { ErrorBoundary } from "./error-boundary/ErrorBoundary";
import { SearchPage } from "./pages/SearchPage";

export function App() {
        return (
            <ErrorBoundary>
                 <SearchPage />
            </ErrorBoundary>
        );
    }

export default App;