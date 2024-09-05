import { useEffect, useState, useMemo, useCallback } from "react";
import clone from "rfdc/default";
import stringMath from "string-math";
import { sample } from "lodash";

import "./App.css";
import { generateNewGrid } from "./utils";
import { allowedSymbols, expressions, gridSize } from "./utils/constants";

function App() {
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

  const evaluateAnswer = useCallback(() => {
    const tempGrid = clone(answerGrid);
    const currentRow = tempGrid[currentRowIndex];
    const answerString = currentRow.reduce(
      (acc, { symbol }) => acc.concat(symbol),
      ""
    );
    const evaluatedAnswer = stringMath(answerString);
    let validExpression = correctExpression;

    // account for expressions that are cumulatively equivalent
    if (
      evaluatedAnswer === correctEvaluation &&
      answerString !== correctExpression
    ) {
      validExpression = answerString;
    }

    for (let i = 0; i < currentRow.length; i++) {
      if (currentRow[i].symbol === validExpression.charAt(i)) {
        tempGrid[currentRowIndex][i].correctPlacement = true;
        tempGrid[currentRowIndex][i].correctSymbol = true;
      } else if (validExpression.includes(currentRow[i].symbol)) {
        const areAllDuplicatesCorrectlyPlaced = validExpression
          .split("")
          .every((symbol, index) => {
            if (symbol === currentRow[index].symbol) {
              return symbol === currentRow[index].symbol;
            }
            return true;
          });
        if (!areAllDuplicatesCorrectlyPlaced) {
          tempGrid[currentRowIndex][i].correctSymbol = true;
        }
      }
    }

    setAnswerGrid(tempGrid);
  }, [answerGrid, correctEvaluation, correctExpression, currentRowIndex]);

  useEffect(() => {
    const rowAnswered = answerGrid[currentRowIndex].every((answer) => {
      return !!answer.symbol;
    });
    if (rowAnswered) {
      evaluateAnswer();
      setCurrentRowIndex(currentRowIndex + 1);
    }
  }, [currentRowIndex, answerGrid, setAnswerGrid, evaluateAnswer]);

  return (
    <>
      <h1 className="text-[80px]">Mathler</h1>
      <h2 className="text-[30px]">
        Guess the expression that evaluates to:{" "}
        <span className="font-black">{correctEvaluation} </span>
      </h2>
      <div>
        {answerGrid.map((row, i) => (
          <div
            key={i}
            className={`flex flex-row border-4 rounded-[10px] ${
              currentRowIndex === i ? "border-white" : "border-transparent"
            } transition-all`}
          >
            {row.map((answer, j) => (
              <div key={j} className="m-5 color-black">
                <input
                  id={`symbol${i.toString()}${j.toString()}`}
                  className={`${
                    answer.correctPlacement && answer.correctSymbol
                      ? "bg-green-800"
                      : answer.correctSymbol
                      ? "bg-yellow-800"
                      : "bg-black"
                  } text-white text-[40px] text-center align-middle w-[80px] h-[80px]`}
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
    </>
  );
}

export default App;
