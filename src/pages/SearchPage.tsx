import { Component } from "react";
import { Main } from "../layout/Main/Main";
import { Search } from "../components/Search/Search";
import { CardList } from "../components/CardList/CardList";
import { type Item } from "../types/item";

export class SearchPage extends Component {
    private mockResults: Item[] = [
        { name: "First Item", description: "Description for the first item" },
        { name: "Second Item", description: "Description for the second item" },
        { name: "Third Item", description: "Description for the third item" },
    ];

    render() {
        return (
            <Main
                search={<Search />}
                results={<CardList items={this.mockResults} />}
            />
        );
    }
}