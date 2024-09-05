import { useEffect, useState } from "react";
import clone from "rfdc/default";
import "./App.css";
const allowedSymbols = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "0",
  "*",
  "-",
  "+",
  "/",
];
function App() {
  const [currentRow, setCurrentRow] = useState(0);
  const [answerGrid, setAnswerGrid] = useState(
    new Array(6).fill(
      new Array(6).fill({
        symbol: "",
        correctSymbol: false,
        correctPlacement: false,
      })
    )
  );
  const handleSymbolInput = (row, column, event) => {
    const symbol = event.target.value;
    if (symbol !== "" && !allowedSymbols.includes(symbol)) return;
    let tempGrid = clone(answerGrid);
    tempGrid[row][column].symbol = symbol;
    setAnswerGrid(tempGrid);
  };

  const evaluateAnswer = () => {
    //tbd
  };

  useEffect(() => {
    const rowAnswered = answerGrid[currentRow].every((answer) => {
      return !!answer.symbol;
    });
    if (rowAnswered) {
      evaluateAnswer();
      setCurrentRow(currentRow + 1);
    }
  }, [currentRow, answerGrid, setAnswerGrid]);

  return (
    <>
      <div>
        {answerGrid.map((row, i) => (
          <div
            key={i}
            className={`flex flex-row border-4 rounded-[10px] ${
              currentRow === i ? "border-white" : "border-transparent"
            } transition-all`}
          >
            {row.map((answer, j) => (
              <div key={j} className="m-5 color-black">
                <input
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
                  disabled={i !== currentRow}
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
