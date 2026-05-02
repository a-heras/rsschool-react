import { Component, type ChangeEvent } from "react";

interface SearchProps {
    onSearch: (term: string) => void;
}

interface SearchState {
    searchTerm: string;
}

export class Search extends Component<SearchProps, SearchState> {
    constructor(props: SearchProps) {
        super(props);
        this.state = {
            searchTerm: "",
        }
    }

    componentDidMount() {
        const saved = localStorage.getItem("searchTerm");

        if(saved) {
            this.setState({searchTerm: saved});
        }
    }
    
    handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        this.setState({searchTerm: value});
        localStorage.setItem("searchTerm", value);
    }

    handleSearchClick = () => {
        const trimmed = this.state.searchTerm.trim();
        this.props.onSearch(trimmed);
    }

    render() {
        return (
            <div>
                <input
                    type="text"
                    value={this.state.searchTerm}
                    onChange={this.handleChange}
                    placeholder="Search..."
                />
                <button onClick={this.handleSearchClick}>Search</button>
            </div>
        );
    }

}