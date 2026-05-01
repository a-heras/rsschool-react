import { Component } from "react";
import { type Item } from "../../types/item";
import "./Card.css";

interface CardProps {
    item: Item;
}

export class Card extends Component<CardProps> {
    render() {
        const {item} = this.props;
        
        return(
            <div className="card">
                <h3 className="card-title">{item.name}</h3>
                <p className="card-description">{item.description}</p>
            </div>
        );
    }
}