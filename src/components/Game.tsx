import { FC, useCallback, useMemo, useState } from "react";
import { Direction, MaybeDirection } from "../models/Direction";
import { SlidingBlockError } from "../models/SlidingBlockError";
import { Board as BoardModel } from "../models/Board";
import { SeedForm } from "./SeedForm";
import { Board } from "./Board";

const invalidSeedErrorMessage = 'Invalid seed value. It should be a 2-dimensional array of Directions.';

/**
 * Checks that a seed is the correct shape.
 *
 * It's not as comprehensive as the checks in `Board`'s constructor: it doesn't check that there are actually any cells.
 * It just confirms the `MaybeDirection[][]` type, which could simply be `[[]]`.
 */
function seedIsValid(candidate: unknown): candidate is MaybeDirection[][] {
    return Array.isArray(candidate) && candidate.every((row): boolean => {
        return Array.isArray(row) && row.every((maybeDirection): boolean => {
            // every() doesn't check empty indices, but that's okay here
            return maybeDirection === undefined || (typeof maybeDirection === 'number' && maybeDirection >= 0 && maybeDirection < 4);
        });
    });
}

function getSeed(formData: FormData, seedTextFieldname: string): MaybeDirection[][] {
    const seedInputString = formData.get(seedTextFieldname); // File | string
    if (typeof seedInputString !== 'string' || !seedInputString.trim()) {
        throw new SlidingBlockError(invalidSeedErrorMessage);
    }
    const parsedSeedInput: unknown = JSON.parse(seedInputString.trim());
    if (!seedIsValid(parsedSeedInput)) {
        throw new SlidingBlockError(invalidSeedErrorMessage);
    }
    return parsedSeedInput;
}

function useGameBoard(seedTextFieldName: string): { board: BoardModel, formAction(formData: FormData): void } {
    const [seed, setSeed] = useState<MaybeDirection[][]>([[Direction.right]]);
    const board = useMemo((): BoardModel => new BoardModel(seed), [seed]);
    const formAction = useCallback((formData: FormData): void => {
        const seed = getSeed(formData, seedTextFieldName);
        setSeed(seed);
    }, [seedTextFieldName]);
    return {
        board,
        formAction,
    };
}

export const Game: FC = () => {
    const { board, formAction } = useGameBoard('seed');
    return <>
        <Board
            board={board}
        />
        <SeedForm
            action={formAction}
            seedTextName="seed"
        />
    </>;
};
