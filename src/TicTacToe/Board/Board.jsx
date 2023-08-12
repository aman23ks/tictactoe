// There are redundancies in the code for example you use computerMove insted of isXturn becuase we only want the computer to move.
// Modularize the code more

import React, { useState, useCallback, useEffect } from "react";
import Square from "../Square/Square";
import classes from "./Board.module.css";

const winnerLogic = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const Board = () => {
  const [state, setState] = useState(Array(9).fill(null));
  const [isXTurn, setIsXTurn] = useState(null);
  const [playerSymbol, setPlayerSymbol] = useState(null);
  const [winningSequence, setWinningSequence] = useState([]);
  const [isWinner, setIsWinner] = useState(null);
  const [computerMove, setComputerMove] = useState(null);

  const checkWinner = useCallback(() => {
    for (let logic of winnerLogic) {
      const [a, b, c] = logic;
      if (state[a] != null && state[a] === state[b] && state[a] === state[c]) {
        setWinningSequence([a, b, c]);
        return state[a];
      } else if (!state.includes(null)) {
        return "draw";
      }
    }
    setWinningSequence([]);
    return false;
  }, [state]);

  useEffect(() => {
    setIsWinner(checkWinner());
  }, [state, checkWinner]);

  const botMove = useCallback(async () => {
    if (computerMove === true && isWinner === false) {
      const copyState = [...state];
      const proxyUrl = "https://cors-anywhere.herokuapp.com/";
      const apiUrl = "https://hiring-react-assignment.vercel.app/api/bot";
      const response = await fetch(proxyUrl + apiUrl, {
        method: "POST",
        body: JSON.stringify(copyState),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      
        if (
            typeof data === "number" &&
            data >= 0 &&
            data < 9 &&
            copyState[data] === null
        ) {
            copyState[data] = isXTurn ? "X" : "O";
            setState(copyState);
            if (isXTurn) {
            setPlayerSymbol("O");
            } else {
            setPlayerSymbol("X");
            }
            setIsXTurn(!isXTurn);
        }
    
      setComputerMove(false);
    }
  }, [state, computerMove]);

  useEffect(() => {
    if (isWinner === false){
        botMove();
    }
  }, [botMove]);

  const squareClickHandler = (index) => {
    if (state[index] != null || isWinner) {
      return;
    }
    const copyState = [...state];
    copyState[index] = isXTurn ? "X" : "O";
    if (isXTurn) {
      setPlayerSymbol("O");
    } else {
      setPlayerSymbol("X");
    }
    setState(copyState);
    setIsXTurn(!isXTurn);
    setComputerMove(true);
  };

  const handlePlayAgain = () => {
    setState(Array(9).fill(null));
    setIsXTurn(null);
    setPlayerSymbol(null);
    setWinningSequence([]);
  };

  const handleSymbolSelection = (symbol) => {
    if (symbol === "X") {
      setIsXTurn(true);
    } else {
      setIsXTurn(false);
    }

    setPlayerSymbol(symbol);
    setComputerMove(false);
  };

  const renderSymbolSelection = () => {
    return (
      <center>
        <h2>Select Your Symbol</h2>
        <button onClick={() => handleSymbolSelection("X")}>X</button>
        <button onClick={() => handleSymbolSelection("O")}>O</button>
      </center>
    );
  };

  const renderSquare = (index) => {
    const isWinningSquare = winningSequence.includes(index);
    return (
      <Square
        key={index}
        onClick={() => squareClickHandler(index)}
        value={state[index]}
        isWinningSquare={isWinningSquare}
      />
    );
  };

  const RenderBoardRow = () => {
    return (
      <>
        <div className={classes["board-row"]}>
          {renderSquare(0)}
          {renderSquare(1)}
          {renderSquare(2)}
        </div>
        <div className={classes["board-row"]}>
          {renderSquare(3)}
          {renderSquare(4)}
          {renderSquare(5)}
        </div>
        <div className={classes["board-row"]}>
          {renderSquare(6)}
          {renderSquare(7)}
          {renderSquare(8)}
        </div>
      </>
    );
  };

  return (
    <div className={classes["board-container"]}>
      {!playerSymbol ? (
        renderSymbolSelection()
      ) : isWinner === "draw" ? (
        <>
          <center>
            Game Drawn <button onClick={handlePlayAgain}>Play Again</button>
          </center>
          <RenderBoardRow />
        </>
      ) : isWinner ? (
        <>
          <center>
            {isWinner} Won the Game{" "}
            <button onClick={handlePlayAgain}>Play Again</button>
          </center>
          <RenderBoardRow />
        </>
      ) : (
        <>
          <center>
            <h4>Player {playerSymbol} please move!</h4>
          </center>
          <RenderBoardRow />
        </>
      )}
    </div>
  );
};

export default Board;
