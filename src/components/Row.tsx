import { FC, memo } from "react";
import { Cell } from "../models/Cell";

interface RowProps {
    cells: readonly Cell[];
    rowIndex: number;
}

export const Row: FC<RowProps> = (({ cells, rowIndex }) => {
    return (
        <div
            aria-colcount={cells.length}
            aria-rowindex={rowIndex}
            role="row"
        >
            { cells.map((cell) => (
                <Cell
                    key={`${cell.x.toFixed(0)}-${cell.y.toFixed(0)}`}
                    cell={cell}
                />
            )) }
        </div>
    );
});
