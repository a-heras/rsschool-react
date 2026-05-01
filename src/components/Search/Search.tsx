import { Component, type ChangeEvent } from "react";

interface SearchState {
    searchTerm: string;
}

export class Search extends Component<{}, SearchState> {
    constructor(props: {}) {
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

    render() {
        return (
            <div>
                <input
                    type="text"
                    value={this.state.searchTerm}
                    onChange={this.handleChange}
                    placeholder="Search..."
                />
            </div>
        );
    }

}