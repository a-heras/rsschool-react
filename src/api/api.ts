import { type Item } from '../types/item';
import { ITEMS_PER_PAGE } from '../config/pagination';

const FAIL_CHANCE = 0.01;

function maybeSimulateServerError(): void {
    if (Math.random() < FAIL_CHANCE) {
        throw new Error('Server error: failed to load data');
    }
}

export async function loadDetails(id: string): Promise<Item> {
    if (!id || id === 'undefined') {
        throw new Error('Invalid item id');
    }

    const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);

    if (!res.ok) {
        throw new Error('Failed to load details');
    }

    const post = await res.json();

    maybeSimulateServerError();

    return {
        id: post.id,
        name: post.title,
        description: post.body,
    } satisfies Item;
}

export async function loadData(
    searchTerm: string,
    page: number,
    limit = ITEMS_PER_PAGE
): Promise<{ items: Item[]; total: number }> {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts');

    if (!res.ok) {
        throw new Error('Server error: failed to load data');
    }

    const data = await res.json();

    const mapped: Item[] = data.map(
        (post: { id: number; title: string; body: string }) => ({
            id: post.id,
            name: post.title,
            description: post.body,
        })
    );

    const filtered = !searchTerm
        ? mapped
        : mapped.filter((item) =>
              item.name.toLowerCase().includes(searchTerm.toLowerCase())
          );

    const total = filtered.length;
    const start = (page - 1) * limit;
    const end = start + limit;

    const pageItems = filtered.slice(start, end);

    maybeSimulateServerError();

    return { items: pageItems, total };
}
