import { gridSize } from "./constants";
export const generateNewGrid = () =>
  new Array(gridSize).fill(
    new Array(gridSize).fill({
      symbol: "",
      correctSymbol: false,
      correctPlacement: false,
    })
  );
