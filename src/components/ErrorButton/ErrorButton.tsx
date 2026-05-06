import { Component } from "react";
import "./ErrorButton.css"

interface ErrorButtonState {
  throwError: boolean;
}

export class ErrorButton extends Component<Record<string, never>, ErrorButtonState> {
  constructor(props: Record<string, never>) {
    super(props);
    this.state = { throwError: false };
  }

  handleClick = () => {
    this.setState({ throwError: true });
  };

  render() {
    if (this.state.throwError) {
      throw new Error("Test error triggered by ErrorButton");
    }

    return (
      <div className="error-button-container">
        <button className="error-trigger-button" onClick={this.handleClick}>
          Throw Error
        </button>
      </div>
    );
  }
}
