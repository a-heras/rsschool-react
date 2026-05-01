import { Component } from "react";
import { type Item } from "../../types/item";
import { Card } from "../Card/Card";
import "./CardList.css"
interface CardListProps {
    items: Item[];
}

export class CardList extends Component<CardListProps> {
    render() {
        return(
            <div className="card-list ">
                {this.props.items.map((item, index) => (
                    <Card key={index} item={item} />
                ))}    
            </div>
        );
    }
}