import "./App.css";

function App() {
  const answerGrid = new Array(6).fill(
    new Array(6).fill({
      symbol: "x",
      correctSymbol: false,
      correctPlacement: false,
    })
  );

  return (
    <>
      <div>
        {answerGrid.map((row, i) => (
          <div key={i} className="flex flex-row">
            {row.map((item, j) => (
              <div key={j} className="color-white">
                {item.symbol}
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
