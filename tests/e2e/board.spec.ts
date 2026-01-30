import { test as baseTest, expect } from '@playwright/test';
import { BoardPage } from './board.page';
import { Direction } from '../../src/models/Direction';

const test = baseTest.extend<{ boardPage: BoardPage }>({
    async boardPage({ page }, use) {
        const boardPage = new BoardPage(page);
        await boardPage.goto();
        await use(boardPage);
    },
});

test('renders a board', async ({ boardPage }): Promise<void> => {
    await boardPage.useSeed([
        [],
        [undefined, Direction.right, Direction.down, undefined],
        [undefined, undefined, Direction.left],
        [undefined, Direction.up, Direction.left],
        [],
    ]);
    await expect(boardPage.cell).toHaveCount(20);
    await expect(boardPage.row).toHaveCount(5);
});
