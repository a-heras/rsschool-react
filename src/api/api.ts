import {type Item} from "../types/item"

export function loadData(searchTerm:string): Promise<Item[]> {
    return new Promise((resolve) => {
        setTimeout(() => {
            const allItems: Item[] = [
                { name: "First Item", description: "Description for the first item" },
                { name: "Second Item", description: "Description for the second item" },
                { name: "Third Item", description: "Description for the third item" },
            ];

            if(!searchTerm) {
                resolve(allItems);
            } else {
                resolve(
                    allItems.filter((item) => 
                        item.name.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                );
            }
        }, 500);
    });
}