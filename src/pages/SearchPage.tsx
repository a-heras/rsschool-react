import { Component } from "react";
import { Main } from "../layout/Main/Main";
import { Search } from "../components/Search/Search";
import { CardList } from "../components/CardList/CardList";
import { type Item } from "../types/item";
import { loadData } from "../api/api";

interface SearchPageState {
    items: Item[];
}

export class SearchPage extends Component<{}, SearchPageState> {
    constructor(props: {}){
        super(props);
        this.state = {
            items: [],
        };
    }

    componentDidMount() {
        const saved = localStorage.getItem("searchTerm") || "";

        loadData(saved).then((items) => {
            this.setState({items})
        });
    }
    render() {
        return (
            <Main
                search={<Search />}
                results={<CardList items={this.state.items} />}
            />
        );
    }
}