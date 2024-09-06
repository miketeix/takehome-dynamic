import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect, vi } from "vitest";
import App from "../src/App";
import { gridSize } from "../src/utils/constants";

// Mock external imports
vi.mock("./utils/constants", () => ({
  allowedSymbols: ["1", "2", "3", "+", "-", "*", "/"],
  gridSize: 3,
  expressions: ["1+2", "3*2"],
}));

vi.mock("./utils", () => ({
  generateNewGrid: vi.fn(() => [
    [
      { symbol: "", correctPlacement: false, correctSymbol: false },
      { symbol: "", correctPlacement: false, correctSymbol: false },
      { symbol: "", correctPlacement: false, correctSymbol: false },
    ],
    [
      { symbol: "", correctPlacement: false, correctSymbol: false },
      { symbol: "", correctPlacement: false, correctSymbol: false },
      { symbol: "", correctPlacement: false, correctSymbol: false },
    ],
    [
      { symbol: "", correctPlacement: false, correctSymbol: false },
      { symbol: "", correctPlacement: false, correctSymbol: false },
      { symbol: "", correctPlacement: false, correctSymbol: false },
    ],
  ]),
}));

vi.mock("string-math", () => ({
  default: vi.fn((expr) => eval(expr)),
}));

vi.mock("lodash", () => ({
  sample: vi.fn((arr) => arr[0]),
}));

describe("App Component", () => {
  it("renders correctly with the initial UI", () => {
    render(<App />);
    expect(screen.getByText("Mathler")).toBeInTheDocument();
    expect(
      screen.getByText(/Guess the expression that evaluates to:/)
    ).toBeInTheDocument();
  });

  it("should render a grid with inputs", () => {
    render(<App />);
    const inputs = screen.getAllByRole("textbox");
    expect(inputs.length).toBe(gridSize * gridSize); // gridSize x gridSize inputs
  });

  it("should allow symbol input and update the grid", () => {
    const result = render(<App />);
    const input = result.container.querySelector("#symbol00"); // First input in the grid
    fireEvent.change(input, { target: { value: "1" } });
    expect(input.value).toBe("1");
  });

  it("should not allow disallowed symbols", () => {
    const result = render(<App />);
    const input = result.container.querySelector("#symbol00");
    fireEvent.change(input, { target: { value: "a" } });
    expect(input.value).toBe(""); // Should remain empty as 'a' is not allowed
  });

  it("should focus on the next input when a symbol is entered", () => {
    const result = render(<App />);
    const input = result.container.querySelector("#symbol00");
    const nextInput = result.container.querySelector("#symbol01");
    fireEvent.change(input, { target: { value: "1" } });
    expect(nextInput).toHaveFocus();
  });
});
