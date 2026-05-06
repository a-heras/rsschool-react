import { Component } from "react";
import { Main } from "../layout/Main/Main";
import { Search } from "../components/Search/Search";
import { CardList } from "../components/CardList/CardList";
import { type Item } from "../types/item";
import { loadData } from "../api/api";
import { Loading } from "../components/Loading/Loading";
import { ErrorMessage } from "../components/ErrorMessage/ErrorMessage";
import { ErrorButton } from "../components/ErrorButton/ErrorButton";

interface SearchPageState {
    items: Item[];
    lastSearchTerm: string;
    loading: boolean;
    error: string | null;
}

export class SearchPage extends Component<Record<string, never>, SearchPageState> {
    constructor(props: Record<string, never>){
        super(props);
        this.state = {
            items: [],
            lastSearchTerm: "",
            loading: false,
            error: null,
        };
    }

    componentDidMount() {
        const saved = localStorage.getItem("searchTerm") || "";

        this.setState({ loading: true, error: null });

        loadData(saved).then((items) => {
            this.setState({
                items,
                lastSearchTerm: saved,
                loading: false,
                error: null,
            });
        })
        .catch(() => {
            this.setState({
                loading: false,
                error: "Failed to load data. Please try again.",
            });
        });
    }

    handleSearch = (term: string) => {
        const trimmed = term.trim();

        if (trimmed === this.state.lastSearchTerm) {
            return;
        }

        this.setState({loading: true, error: null});
        localStorage.setItem("searchTerm", trimmed)

        loadData(trimmed).then((items) => {
            this.setState({
                items,
                lastSearchTerm: trimmed,
                loading: false,
                error: null,
            });
        })
        .catch(() => {
            this.setState({
                loading: false,
                error: "Failed to load data. Please try again.",
            });
        });
    };

    render() {
        return (
            <Main
                search={<Search onSearch={this.handleSearch} />}
                results={
                    <div>
                        {this.state.error ? (
                            <ErrorMessage message={this.state.error} />
                        ) : this.state.loading ? (
                            <Loading />
                        ) : (
                            <CardList items={this.state.items} />
                        )}

                        <div>
                            <ErrorButton />
                        </div>
                    </div>
                }
            />
        );
    }
}