import { Component } from "react";
import { Main } from "../layout/Main/Main";
import { Search } from "../components/Search/Search";
import { CardList } from "../components/CardList/CardList";
import { type Item } from "../types/item";
import { loadData } from "../api/api";
import { Loading } from "../components/Loading/Loading";

interface SearchPageState {
    items: Item[];
    lastSearchTerm: string;
    loading: boolean;
}

export class SearchPage extends Component<{}, SearchPageState> {
    constructor(props: {}){
        super(props);
        this.state = {
            items: [],
            lastSearchTerm: "",
             loading: false,
        };
    }

    componentDidMount() {
        const saved = localStorage.getItem("searchTerm") || "";

        this.setState({loading: true});

        loadData(saved).then((items) => {
            this.setState({
                items,
                lastSearchTerm: saved,
                loading: false,
            });
        });
    }

    handleSearch = (term: string) => {
        const trimmed = term.trim();

        if (trimmed === this.state.lastSearchTerm) {
            return;
        }

        this.setState({loading: true});
        localStorage.setItem("searchTerm", trimmed)

        loadData(trimmed).then((items) => {
            this.setState({
                items,
                lastSearchTerm: trimmed,
                loading: false,
            });
        });
    };

    render() {
        return (
            <Main
                search={<Search onSearch={this.handleSearch}/>}
                results={
                    this.state.loading
                    ? <Loading />
                    : <CardList items={this.state.items} />
                }
            />
        );
    }
}