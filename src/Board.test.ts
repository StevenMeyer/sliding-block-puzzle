import { Board } from "./Board";
import { Direction } from "./Direction";

describe('Board', function (): void {
    it('creates a 1x1 board', function (): void {
        const board = new Board([[Direction.right]]);
        expect(board.height).toBe(1);
        expect(board.width).toBe(1);
    });

    it('creates a 2x2 board', function (): void {
        const board = new Board([
            [Direction.up, Direction.left],
            [Direction.down, Direction.down],
        ]);
        expect(board.height).toBe(2);
        expect(board.width).toBe(2);
    });

    it('creates rectangular boards and does not need complete rows', function (): void {
        const board = new Board([
            [Direction.up, Direction.up],
            [Direction.up, Direction.up, Direction.up, Direction.up],
            [Direction.up, undefined,    Direction.up],
        ]);
        expect(board.height).toBe(3);
        expect(board.width).toBe(4);
    });

    it('throws an error if there are 0 rows or 0 columns', function (): void {
        expect(function (): void {
            new Board([]);
        }).toThrow('A board must have at least one row with at least one column');

        expect(function (): void {
            new Board([
                [],
                [],
            ]);
        }).toThrow('A board must have at least one row with at least one column');
    });

    interface SlideTest {
        direction: string;
        boardStart: (Direction | undefined)[][];
        expectedBoardResult: (Direction | undefined)[][];
        slideCoord: [number, number];
    }

    describe.each<SlideTest>([
        {
            direction: 'right',
            boardStart: [
                [],
                [undefined, Direction.right, Direction.up, undefined],
                /*          ^ slide this one */
                [],
            ],
            expectedBoardResult: [
                [undefined, undefined,       undefined,    undefined],
                [undefined, Direction.right, Direction.up, undefined],
                [undefined, undefined,       undefined,    undefined],
            ],
            slideCoord: [1, 1],
        },
        {
            direction: 'left',
            boardStart: [
                [],
                [undefined, Direction.up, Direction.left, undefined],
                /*                        ^ slide this one */
                [],
            ],
            expectedBoardResult: [
                [undefined, undefined,    undefined,      undefined],
                [undefined, Direction.up, Direction.left, undefined],
                [undefined, undefined,    undefined,      undefined],
            ],
            slideCoord: [2, 1],
        },
        {
            direction: 'down',
            boardStart: [
                [],
                [undefined, Direction.down, undefined],
                /*          ^ slide this one */
                [undefined, Direction.left, undefined],
                [],
            ],
            expectedBoardResult: [
                [undefined, undefined,      undefined],
                [undefined, Direction.down, undefined],
                [undefined, Direction.left, undefined],
                [undefined, undefined,      undefined],
            ],
            slideCoord: [1, 1],
        },
        {
            direction: 'up',
            boardStart: [
                [],
                [undefined, Direction.left, undefined],
                [undefined, Direction.up,   undefined],
                /*          ^ slide this one */
                [],
            ],
            expectedBoardResult: [
                [undefined, undefined,      undefined],
                [undefined, Direction.left, undefined],
                [undefined, Direction.up, undefined],
                [undefined, undefined,      undefined],
            ],
            slideCoord: [1, 2],
        },
    ])('sliding $direction adjacent to another Block', function ({ boardStart, expectedBoardResult, slideCoord }): void {
        it('prevents the block from moving', function (): void {
            const board = new Board(boardStart);
            expect(board.slide(slideCoord)).toBe(false);
            expect(board.toJSON()).toEqual(expectedBoardResult);
        });
    });

    describe.each<SlideTest>([
        {
            direction: 'right',
            boardStart: [
                [],
                [undefined, Direction.right, undefined, undefined],
                /*          ^ slide this one */
                [],
            ],
            expectedBoardResult: [
                [undefined, undefined, undefined, undefined],
                [undefined, undefined, undefined, undefined],
                [undefined, undefined, undefined, undefined],
            ],
            slideCoord: [1, 1],
        },
        {
            direction: 'left',
            boardStart: [
                [],
                [undefined, undefined, Direction.left, undefined],
                /*                     ^ slide this one */
                [],
            ],
            expectedBoardResult: [
                [undefined, undefined, undefined, undefined],
                [undefined, undefined, undefined, undefined],
                [undefined, undefined, undefined, undefined],
            ],
            slideCoord: [2, 1],
        },
        {
            direction: 'down',
            boardStart: [
                [],
                [undefined, Direction.down, undefined],
                /*          ^ slide this one */
                [],
                [],
            ],
            expectedBoardResult: [
                [undefined, undefined, undefined],
                [undefined, undefined, undefined],
                [undefined, undefined, undefined],
                [undefined, undefined, undefined],
            ],
            slideCoord: [1, 1],
        },
        {
            direction: 'up',
            boardStart: [
                [],
                [],
                [undefined, Direction.up, undefined],
                /*          ^ slide this one */
                [],
            ],
            expectedBoardResult: [
                [undefined, undefined, undefined],
                [undefined, undefined, undefined],
                [undefined, undefined, undefined],
                [undefined, undefined, undefined],
            ],
            slideCoord: [1, 2],
        },
    ])('sliding $direction unimpeded by other Blocks', function ({ boardStart, expectedBoardResult, slideCoord }): void {
        it('slides the Block right off the board', function (): void {
            const board = new Board(boardStart);
            expect(board.slide(slideCoord)).toBe(true);
            expect(board.toJSON()).toEqual(expectedBoardResult);
        });
    });

    describe.each<SlideTest>([
        {
            direction: 'right',
            boardStart: [
                [],
                [undefined, Direction.right, undefined, undefined, Direction.up, undefined],
                /*          ^ slide this one */
                [],
            ],
            expectedBoardResult: [
                [undefined, undefined, undefined, undefined,       undefined,    undefined],
                [undefined, undefined, undefined, Direction.right, Direction.up, undefined],
                [undefined, undefined, undefined, undefined,       undefined,    undefined],
            ],
            slideCoord: [1, 1],
        },
        {
            direction: 'left',
            boardStart: [
                [],
                [undefined, Direction.up, undefined, undefined, Direction.left, undefined],
                /*                                              ^ slide this one */
                [],
            ],
            expectedBoardResult: [
                [undefined, undefined,    undefined,      undefined, undefined, undefined],
                [undefined, Direction.up, Direction.left, undefined, undefined, undefined],
                [undefined, undefined,    undefined,      undefined, undefined, undefined],
            ],
            slideCoord: [4, 1],
        },
        {
            direction: 'down',
            boardStart: [
                [],
                [undefined, Direction.down, undefined],
                /*          ^ slide this one */
                [],
                [],
                [undefined, Direction.left],
                [],
            ],
            expectedBoardResult: [
                [undefined, undefined,      undefined],
                [undefined, undefined,      undefined],
                [undefined, undefined,      undefined],
                [undefined, Direction.down, undefined],
                [undefined, Direction.left, undefined],
                [undefined, undefined,      undefined],
            ],
            slideCoord: [1, 1],
        },
    ])('sliding $direction with spaces but eventually blocked by other Blocks', function ({ boardStart, expectedBoardResult, slideCoord }): void {
        it('slides the Block along the empty spaces', function (): void {
            const board = new Board(boardStart);
            expect(board.slide(slideCoord)).toBe(true);
            expect(board.toJSON()).toEqual(expectedBoardResult);
        });
    });

    it('wins when the board is cleared', function (): void {
        const board1 = new Board([
            [undefined],
        ]);
        expect(board1.isWon).toBe(true);

        const board2 = new Board([
            [Direction.right],
        ]);
        expect(board2.isWon).toBe(false);

        board2.slide([0, 0]);
        expect(board2.isWon).toBe(true);

        const board3 = new Board([
            [],
            [undefined, Direction.right, Direction.down, undefined],
            [undefined, undefined, Direction.right],
            [undefined, Direction.up, Direction.left],
            [],
        ]);
        expect(board3.isWon).toBe(false);
        expect(board3.slide([2, 2])).toBe(true);
        expect(board3.isWon).toBe(false);
        expect(board3.slide([2, 1])).toBe(true);
        expect(board3.slide([1, 1])).toBe(true);
        expect(board3.slide([1, 3])).toBe(true);
        expect(board3.slide([2, 3])).toBe(true);
        expect(board3.isWon).toBe(false);
        expect(board3.slide([2, 2])).toBe(true);
        expect(board3.isWon).toBe(true);
    })
});
