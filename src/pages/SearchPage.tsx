import { Component } from "react";
import { Main } from "../layout/Main/Main";

export class SearchPage extends Component {
  render() {
    return (
        <Main
            search={<input type="text" placeholder="Search here..." />}
            results={<div>Results list will be here</div>}
        />
    );
  }
}