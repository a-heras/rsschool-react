'use client';

import { type Item } from '@/types/item';
import './Card.css';

interface CardProps {
    item: Item;
    isSelected: boolean;
    onToggleSelect: (item: Item) => void;
    onOpenDetails: (id: string) => void;
}

export function Card({
    item,
    isSelected,
    onToggleSelect,
    onOpenDetails,
}: CardProps) {
    return (
        <tr
            className="table-row"
            onClick={() => onOpenDetails(String(item.id))}
        >
            <td className="table-cell checkbox-cell">
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleSelect(item)}
                    onClick={(e) => e.stopPropagation()}
                    aria-label={`Select ${item.name}`}
                />
            </td>
            <td className="table-cell name-cell">{item.name}</td>
            <td className="table-cell desc-cell">{item.description}</td>
        </tr>
    );
}
