import { Board } from "./Board";
import { Cell } from "./Cell";
import { MaybeDirection } from "./Direction";

interface ListItem<T> {
    next?: ListItem<T>;
    previous?: ListItem<T>;
    item: T;
}

class LinkedList<T> implements Iterable<T, void> {
    private first?: ListItem<T>;
    private last?: ListItem<T>;

    get length(): number {
        return Array.from(this).length;
    }

    constructor(initialCollection?: Iterable<T>) {
        if (!initialCollection) {
            return;
        }
        for (const item of initialCollection) {
            this.push(item);
        }
    }

    peek(): T | undefined {
        return this.last?.item;
    }

    push(item: T): void {
        const listItem: ListItem<T> = { item };
        if (!this.last) {
            this.first = listItem;
            this.last = listItem;
            return;
        }
        listItem.previous = this.last;
        this.last.next = listItem;
        this.last = listItem;
    }

    pop(): T | undefined {
        if (!this.last) {
            return;
        }
        const { item, previous } = this.last;
        this.last.previous = undefined;
        this.last = previous;
        if (previous) {
            previous.next = undefined;
        } else {
            this.first = undefined;
        }
        return item;
    }

    *[Symbol.iterator]() {
        for (let listItem = this.first; listItem; listItem = listItem.next) {
            yield listItem.item;
        }
    }
}

interface BoardState {
    state: Cell[][];
}

export function boardAsState(seedOrBoard: Board | readonly (readonly MaybeDirection[])[]): BoardState {
    if (Array.isArray(seedOrBoard)) {
        return boardAsState(new Board(seedOrBoard));
    }
    const history = new LinkedList<Board>([seedOrBoard as Board]);
    let currentState: Cell[][] | undefined;

    return {
        get state() {
            currentState ??= (history.peek() ?? seedOrBoard as Board).getMap();
            return currentState;
        },
    };
}
