import { useState } from "react";
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
  const [answerGrid, setAnswerGrid] = useState(
    new Array(6).fill(
      new Array(6).fill({
        symbol: "",
        correctSymbol: false,
        correctPlacement: false,
      })
    )
  );
  const handleChange = (row, column, event) => {
    const symbol = event.target.value;
    if (symbol !== "" && !allowedSymbols.includes(symbol)) return;
    let tempGrid = clone(answerGrid);
    tempGrid[row][column].symbol = symbol;
    setAnswerGrid(tempGrid);
  };

  return (
    <>
      <div>
        {answerGrid.map((row, i) => (
          <div key={i} className="flex flex-row">
            {row.map((item, j) => (
              <div key={j} className="m-5 color-black">
                <input
                  className="bg-green-800 text-black text-[40px] text-center align-middle w-[80px] h-[80px] "
                  maxLength="1"
                  type="text"
                  value={item.symbol}
                  onChange={(e) => handleChange(i, j, e)}
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
