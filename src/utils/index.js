export const generateNewGrid = () =>
  new Array(6).fill(
    new Array(6).fill({
      symbol: "",
      correctSymbol: false,
      correctPlacement: false,
    })
  );
