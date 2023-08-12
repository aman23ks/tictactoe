import React, { memo } from "react";
import classes from "./Square.module.css";

const Square = ({ value, onClick, isWinningSquare }) => {
    const squareClassName = `${classes.square} ${isWinningSquare ? classes.winning : ""}`;

    return (
        <div className={squareClassName} onClick={onClick}>
            <h2>{value}</h2>
        </div>
    );
};

export default memo(Square);
