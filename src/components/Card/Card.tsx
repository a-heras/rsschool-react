import { type Item } from "../../types/item";
import "./Card.css";

interface CardProps {
    item: Item;
    onClick?: () => void;
}

export function Card({item, onClick}: CardProps) {
    return(
        <tr className="table-row" onClick={onClick}>
            <td className="table-cell name-cell">{item.name}</td>
            <td className="table-cell desc-cell">{item.description}</td>
        </tr>
    );
}