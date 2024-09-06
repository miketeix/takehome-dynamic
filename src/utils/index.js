import clone from "rfdc/default";
import stringMath from "string-math";

import { gridSize } from "./constants";
export const generateNewGrid = () =>
  new Array(gridSize).fill(
    new Array(gridSize).fill({
      symbol: "",
      correctSymbol: false,
      correctPlacement: false,
    })
  );

export const evaluateAnswerGrid = (
  answerGrid,
  correctEvaluation,
  correctExpression,
  currentRowIndex
) => {
  const updatedGrid = clone(answerGrid);
  const currentRow = updatedGrid[currentRowIndex];
  const answerString = currentRow.reduce(
    (acc, { symbol }) => acc.concat(symbol),
    ""
  );

  let evaluatedAnswer;
  try {
    evaluatedAnswer = stringMath(answerString);
  } catch {
    // silence expression parsing errors
  }

  let validExpression = correctExpression;

  // account for expressions that are cumulatively equivalent
  if (
    evaluatedAnswer === correctEvaluation &&
    answerString !== correctExpression
  ) {
    validExpression = answerString;
  }

  for (let i = 0; i < currentRow.length; i++) {
    const symbol = currentRow[i].symbol;
    if (symbol === validExpression.charAt(i)) {
      updatedGrid[currentRowIndex][i].correctPlacement = true;
      updatedGrid[currentRowIndex][i].correctSymbol = true;
      updatedGrid[currentRowIndex + 1][i].symbol = symbol;
    } else if (validExpression.includes(symbol)) {
      const aMisplacedMatchExists = validExpression
        .split("")
        .some((validSymbol, index) => {
          if (symbol === validSymbol) {
            return symbol !== currentRow[index].symbol;
          }
          return false; // not a match
        });

      if (aMisplacedMatchExists) {
        updatedGrid[currentRowIndex][i].correctSymbol = true;
      }
    }
  }
  return updatedGrid;
};
