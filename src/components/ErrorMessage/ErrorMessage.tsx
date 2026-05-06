import { Component } from "react";
import "./ErrorMessage.css";

interface ErrorMessageProps {
    message: string;
}

export class ErrorMessage extends Component<ErrorMessageProps> {
    render() {
        return <div className="error-message">{this.props.message}</div>;
    }
}