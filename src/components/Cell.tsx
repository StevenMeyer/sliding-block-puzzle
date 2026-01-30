import { FC } from "react";
import { Cell as CellModel } from "../models/Cell";

interface CellProps {
    cell: CellModel;
}

export const Cell: FC<CellProps> = ({ cell }) => {
    return (
        <div
            aria-colindex={cell.x}
            role="gridcell"
        ></div>
    );
};
