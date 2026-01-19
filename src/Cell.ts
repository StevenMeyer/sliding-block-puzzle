import { SlideBlock } from "./Block";
import { Direction } from "./Direction";

export class Cell {
    block?: SlideBlock;
    readonly x: number;
    readonly y: number;

    constructor(coOrdinate: [number, number], block: Direction | undefined) {
        this.block = typeof block === 'number' ? new SlideBlock(block) : undefined;
        this.x = coOrdinate[0];
        this.y = coOrdinate[1];
    }
}