import { Component } from "react";
import { Main } from "../layout/Main/Main";
import { Search } from "../components/Search/Search";
import { CardList } from "../components/CardList/CardList";
import { type Item } from "../types/item";
import { loadData } from "../api/api";

interface SearchPageState {
    items: Item[];
    lastSearchTerm: string;
}

export class SearchPage extends Component<{}, SearchPageState> {
    constructor(props: {}){
        super(props);
        this.state = {
            items: [],
            lastSearchTerm: "",
        };
    }

    componentDidMount() {
        const saved = localStorage.getItem("searchTerm") || "";

        loadData(saved).then((items) => {
            this.setState({items})
        });
    }

    handleSearch = (term: string) => {
        if (term === this.state.lastSearchTerm) {
            return;
        }

        loadData(term).then((items) => {
            this.setState({
                items,
                lastSearchTerm: term,
            });
        });
    };

    render() {
        return (
            <Main
                search={<Search onSearch={this.handleSearch}/>}
                results={<CardList items={this.state.items} />}
            />
        );
    }
}