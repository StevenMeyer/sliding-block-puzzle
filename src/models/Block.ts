import { Direction } from "./Direction";

export interface SlideBlockOptions {
    /** An identifier which could allow you to track this Block around the board. */
    id?: string;
}

export class SlideBlock {
    /** An identifier which could allow you to track this Block around the board. */
    readonly id?: string;

    constructor(readonly direction: Direction, options?: { id?: string }) {
        this.id = options?.id;
    }
}