import { FC, useMemo, useState } from "react";
import type { Board as BoardModel } from "../models/Board";
import { Cell } from "../models/Cell";
import { boardAsState } from "../models/BoardAsState";

interface BoardProps {
    board: BoardModel;
}

function useBoardAsState(board: BoardModel): ReturnType<typeof boardAsState> {
    return useMemo(() => boardAsState(board), [board]);
}

export const Board: FC<BoardProps> = (({ board }) => {
    const { state } = useBoardAsState(board);
    return (
        <div
            aria-label="Game board"
            aria-rowcount={state.length}
            role="grid"
        >
            { state.map((row, index) => (
                <Row
                    key={index}
                    row={row}
                />
            )) }
        </div>
    );
});
