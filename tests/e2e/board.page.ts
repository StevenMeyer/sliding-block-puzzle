import { Locator, Page } from "@playwright/test";
import { MaybeDirection } from "../../src/models/Direction";

export class BoardPage {
    readonly cell: Locator;
    readonly grid: Locator;
    readonly row: Locator;
    readonly seedTextBox: Locator;
    readonly useSeedButton: Locator;

    constructor(private readonly page: Page) {
        this.grid = page.getByRole('grid', {
            name: 'Game board',
        });
        this.cell = this.grid.getByRole('gridcell');
        this.row = this.grid.getByRole('row');
        this.seedTextBox = page.getByRole('textbox', {
            name: 'Game seed'
        });
        this.useSeedButton = page.getByRole('button', {
            name: 'Use this seed',
        });
    }

    async goto(): Promise<void> {
        await this.page.goto('/');
    }

    async useSeed(seed: readonly (readonly MaybeDirection[])[]): Promise<void> {
        await this.seedTextBox.fill(JSON.stringify(seed));
        await this.useSeedButton.click();
    }
}