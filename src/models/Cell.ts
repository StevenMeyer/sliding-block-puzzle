import { SlideBlock, SlideBlockOptions } from "./Block";
import { Direction } from "./Direction";

export class Cell {
    block?: SlideBlock;
    readonly x: number;
    readonly y: number;

    constructor(coOrdinate: [number, number], block?: { direction?: Direction; options?: SlideBlockOptions }) {
        this.block = typeof block?.direction === 'number' ? new SlideBlock(block.direction, block.options) : undefined;
        this.x = coOrdinate[0];
        this.y = coOrdinate[1];
    }
}