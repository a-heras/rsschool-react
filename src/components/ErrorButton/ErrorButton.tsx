import { Component } from "react";
import "./ErrorButton.css"

export class ErrorButton extends Component {
    handleClick = () => {
        throw new Error("Test error triggered by ErrorButton");
    };

    render() {
        return (
            <div className="error-button-container">
                <button 
                    className="error-trigger-button"
                    onClick={this.handleClick}>
                        Throw Error
                </button>
            </div>
        );
    }
}
