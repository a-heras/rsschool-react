import { type Item } from "../../types/item";
import "./Card.css";

interface CardProps {
    item: Item;
}

export function Card({item}: CardProps) {
    return(
        <tr className="table-row">
            <td className="table-cell name-cell">{item.name}</td>
            <td className="table-cell desc-cell">{item.description}</td>
        </tr>
    );
}