import { type Item } from "../../types/item";
import { Card } from "../Card/Card";
import "./CardList.css"
interface CardListProps {
    items: Item[];
    onItemClick: (id: string) => void;
}

export function CardList({items, onItemClick}: CardListProps) {
    return (
        <table className="results-table">
            <thead>
                <tr>
                    <th>Item Name</th>
                    <th>Item Description</th>
                </tr>
            </thead>
            <tbody>
                {items.map((item) => (
                    <Card
                        key={item.id}
                        item={item}
                        onClick={() => {
                            if (item.id != null) {
                                onItemClick(String(item.id));
                            }
                        }}
                    />
                ))}
            </tbody>
        </table>
    );
}