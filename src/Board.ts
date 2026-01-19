import { BoardError } from "./BoardError";
import { Cell } from "./Cell";
import { Direction } from "./Direction";

type MaybeDirection = Direction | undefined;

export class Board {
    readonly height: number;
    readonly width: number;

    /** Is the board empty (there are no Blocks)? */
    get isWon(): boolean {
        return this.map.every((row) => row.every((cell) => !cell.block));
    }

    /** An internal map of the game board. An array of rows where `map[0][0]` is the top left cell. */
    private readonly map: Cell[][];

    constructor(seed: readonly (readonly MaybeDirection[])[]) {
        if (seed.length === 0) {
            throw new BoardError('A board must have at least one row with at least one column');
        }

        this.height = seed.length;
        this.width = seed.reduce((maxWidth, row): number => {
            return Math.max(maxWidth, row.length);
        }, 0);
        if (this.width === 0) {
            throw new BoardError('A board must have at least one row with at least one column');
        }
        this.map = new Array<Cell[]>(seed.length);
        // we could use Array.prototype.map, but in programming defensively we will guard against sparse arrays.
        // Iteration methods don't visit empty slots in arrays, so a seed containing empty slots could really mess up the game board.
        // By programming defensively, we will be able to use iteration methods safely with instances of Board.
        for (let rowIndex = 0, seedRow = seed[rowIndex]; rowIndex < this.height; rowIndex += 1, seedRow = seed[rowIndex]) {
            const row = new Array<Cell>(this.width);
            this.map[rowIndex] = row;
            for (let colIndex = 0; colIndex < this.width; colIndex += 1) {
                row[colIndex] = new Cell([colIndex, rowIndex], seedRow[colIndex]);
            }
        }
    }

    /**
     * Get a single cell in a row.
     *
     * An accesor for `row[x]` with range check.
     * @throws BoardError with RangeError `cause` if x is outside the array.
     */
    private getCellInRow(row: readonly Cell[], x: number): Cell {
        if (x < 0 || x >= this.width) {
            throw new BoardError('The cell is outside the board area. Check the co-ordinates.', {
                cause: new RangeError('The co-ordinates are out of range.'),
            });
        }
        return row[x];
    }

    /**
     * Get a column from the board map.
     *
     * Unlike `getRow()` this does some work iterating over each row to pick `row[x]` and add it to a new array.
     * @throws BoardError with RangeError `cause` if the column is outside the board's range.
     */
    private getColumn(x: number): Cell[] {
        if (x < 0 || x >= this.width) {
            throw new BoardError('The column is outside the board area. Check the co-ordinates.', {
                cause: new RangeError('The co-ordinates are out of range.'),
            });
        }
        const column = new Array<Cell>(this.height);
        for (let i = 0; i < this.height; i += 1) {
            column[i] = this.map[i][x];
        }
        return column;
    }

    /**
     * Get a row from the board map.
     * @throws BoardError with RangeError `cause` if the row is outside the board's range.
     */
    private getRow(y: number): Cell[] {
        if (y < 0 || y >= this.height) {
            throw new BoardError('The row is outside the board area. Check the co-ordinates.', {
                cause: new RangeError('The co-ordinates are out of range.'),
            });
        }
        return this.map[y];
    }

    /**
     * Slide a Block, if possible.
     *
     * Tries to move the Block at the given co-ordinates.
     * In order to match the `Direction` values, `[0, 0]` is the top left corner of the game board.
     * If the cell contains a Block and the Block were moved, the method returns `true`.
     * @throws BoardError with RangeError `cause` if the co-ordinates are outside the board.
     */
    slide([x, y]: readonly [number, number]): boolean {
        const row = this.getRow(y);
        const cell = this.getCellInRow(row, x);
        if (!cell.block) { // this cell is empty
            return false;
        }

        /** Slide a cell right or down (increase its index in the array) */
        const increase = (cells: Cell[], indexToSlide: number): boolean => {
            const nextCellWithBlockIndex = indexToSlide + 1 + cells.slice(indexToSlide + 1).findIndex((cell): boolean => cell.block !== undefined);
            if (nextCellWithBlockIndex === indexToSlide + 1) { // the next cell is occupied
                return false;
            }
            if (nextCellWithBlockIndex === indexToSlide) { // findIndex() returned -1: there are no more blocks in the row
                cells[indexToSlide].block = undefined;
                return true;
            }
            // move the block to the empty cell
            cells[nextCellWithBlockIndex - 1].block = cell.block;
            cells[indexToSlide].block = undefined;
            return true;
        };

        /** Slide a cell left or up (decrease its index in the array) */
        const decrease = (cells: Cell[], indexToSlide: number): boolean => {
            const revIndex = cells.slice(0, indexToSlide).reverse().findIndex((cell): boolean => cell.block !== undefined);
            const nextCellWithBlockIndex = revIndex === -1 ? -1 : indexToSlide - 1 - revIndex;
            if (nextCellWithBlockIndex === indexToSlide - 1) { // the next cell is occupied
                return false;
            }
            if (nextCellWithBlockIndex === -1) { // findIndex() returned -1: there are no more blocks in the row
                cells[indexToSlide].block = undefined;
                return true;
            }
            // move the block to the empty cell
            cells[nextCellWithBlockIndex + 1].block = cell.block;
            cells[indexToSlide].block = undefined;
            return true;
        };
        
        if (cell.block.direction === Direction.right) {
            return increase(row, x);
        }

        if (cell.block.direction === Direction.left) {
            return decrease(row, x);
        }

        if (cell.block.direction === Direction.down) {
            const column = this.getColumn(x);
            return increase(column, y);
        }

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (cell.block.direction === Direction.up) {
            const column = this.getColumn(x);
            return decrease(column, y);
        }

        return false;
    }

    toJSON(): MaybeDirection[][] {
        return this.map.map((row) => {
            return row.map((cell) => cell.block?.direction);
        });
    }
}