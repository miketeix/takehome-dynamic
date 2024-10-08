import { useEffect, useState, useMemo } from "react";
import clone from "rfdc/default";
import stringMath from "string-math";

import { sample } from "lodash";

import "./App.css";
import { generateNewGrid, evaluateAnswerGrid } from "./utils";
import { allowedSymbols, expressions, gridSize } from "./utils/constants";

function App() {
  const [showHint, setShowHint] = useState(false);
  const [currentRowIndex, setCurrentRowIndex] = useState(0);
  const [correctExpression, _] = useState(sample(expressions));
  const correctEvaluation = useMemo(
    () => stringMath(correctExpression),
    [correctExpression]
  );

  const [answerGrid, setAnswerGrid] = useState(generateNewGrid());
  const handleSymbolInput = (row, column, event) => {
    const symbol = event.target.value;
    if (symbol !== "" && !allowedSymbols.includes(symbol)) return;
    let tempGrid = clone(answerGrid);
    tempGrid[row][column].symbol = symbol;
    setAnswerGrid(tempGrid);

    document
      .getElementById(
        `symbol${column === gridSize - 1 ? (row + 1) % gridSize : row}${
          (column + 1) % gridSize
        }`
      )
      .focus();
  };

  useEffect(() => {
    const rowAnswered = answerGrid[currentRowIndex].every((answer) => {
      return !!answer.symbol;
    });
    if (rowAnswered) {
      const updatedGrid = evaluateAnswerGrid(
        answerGrid,
        correctEvaluation,
        correctExpression,
        currentRowIndex
      );
      setAnswerGrid(updatedGrid);
      setCurrentRowIndex(currentRowIndex + 1);
    }
  }, [
    currentRowIndex,
    answerGrid,
    setAnswerGrid,
    correctEvaluation,
    correctExpression,
  ]);

  return (
    <>
      <h1 className="text-4xl sm:text-7xl">Mathler</h1>
      <h2 className="text-lg sm:text-3xl mt-2">
        Guess the expression that evaluates to:{" "}
        <span className="font-black">{correctEvaluation} </span>
      </h2>
      <div className="aspect-square mt-4">
        {answerGrid.map((row, i) => (
          <div
            key={i}
            className={`flex flex-row border-4 rounded-[10px] ${
              currentRowIndex === i ? "border-white" : "border-transparent"
            } transition-all`}
          >
            {row.map((answer, j) => (
              <div
                key={j}
                className={`m-1 sm:m-5 color-black w-1/${gridSize} aspect-square`}
              >
                <input
                  id={`symbol${i.toString()}${j.toString()}`}
                  className={`${
                    answer.correctPlacement && answer.correctSymbol
                      ? "bg-green-800"
                      : answer.correctSymbol
                      ? "bg-yellow-800"
                      : "bg-black"
                  } text-white text-3xl sm:text-8xl text-center align-middle w-full h-full`}
                  maxLength="1"
                  type="text"
                  value={answer.symbol}
                  onChange={(e) => handleSymbolInput(i, j, e)}
                  disabled={i !== currentRowIndex}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="mb-[20px] mt-4 m-auto flex flex-col align-middle justify-center">
        <p
          className={`text-lg sm:text-3xl mb-5 transition-all ${
            showHint ? "opacity-100" : "opacity-0"
          }`}
        >
          {correctExpression.split("").map((symbol, i) => (
            <span className="mr-5 last:mr-0 align-middle" key={i}>
              {symbol}
            </span>
          ))}
        </p>
        <button
          onMouseDown={() => setShowHint(true)}
          onMouseUp={() => setShowHint(false)}
          onTouchStart={() => setShowHint(true)}
          onTouchEnd={() => setShowHint(false)}
          className={`text-sm sm:text-lg max-w-[200px] m-auto`}
        >
          Show Hint
        </button>
      </div>
    </>
  );
}

export default App;
