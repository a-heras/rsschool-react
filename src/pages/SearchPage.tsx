import { Component } from "react";
import { Main } from "../layout/Main/Main";
import { Search } from "../components/Search/Search";

export class SearchPage extends Component {
  render() {
    return (
        <Main
            search={<Search />}
            results={<div>Results list will be here</div>}
        />
    );
  }
}