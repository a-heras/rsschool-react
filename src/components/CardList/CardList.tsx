import { type Item } from "../../types/item";
import { Card } from "../Card/Card";
import "./CardList.css"
interface CardListProps {
    items: Item[];
}

export function CardList({items}: CardListProps) {
    return (
        <table className="results-table">
            <thead>
                <tr>
                    <th>Item Name</th>
                    <th>Item Description</th>
                </tr>
            </thead>
            <tbody>
                {items.map((item, index) => (
                    <Card key={index} item={item} />
                ))}
            </tbody>
        </table>
    );
}