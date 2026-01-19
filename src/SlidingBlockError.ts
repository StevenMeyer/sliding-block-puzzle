export class SlidingBlockError extends Error {
    readonly name: string = 'SlidingBlockPuzzleError';

    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    constructor(message: string, options?: { cause: unknown }) {
        // @ts-expect-error options object is per the Error constructor spec
        super(message, options);
    }
}
