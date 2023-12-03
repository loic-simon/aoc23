import * as fs from "fs";
import util from "util";

const inputs = fs
  .readFileSync("inputs/day3.txt", "utf8")
  .split("\n")
  .filter((value) => value.length);

// Parse inputs
type Number = {
  row: number;
  colMin: number;
  colMax: number;
  value: number;
};
const numbers: Number[] = inputs
  .map((input, row) =>
    Array.from(input.matchAll(/\d+/g)).map((match) => ({
      value: parseInt(match[0]),
      row,
      colMin: match["index"]!,
      colMax: match["index"]! + match[0].length - 1,
    }))
  )
  .reduce((agg, matches) => [...agg, ...matches]);

console.log(util.inspect(numbers, false, null, true));

type Symbol = {
  row: number;
  col: number;
  value: string;
};
const symbols: Symbol[] = inputs
  .map((input, row) =>
    Array.from(input.matchAll(/[^\w\d\.]/g)).map((match) => ({
      row,
      col: match["index"]!,
      value: match[0],
    }))
  )
  .reduce((agg, matches) => [...agg, ...matches]);

console.log(util.inspect(symbols, false, null, true));

// Utils
const isAdjacent = (symbol: Symbol, number: Number) =>
  number.row - 1 <= symbol.row &&
  symbol.row <= number.row + 1 &&
  number.colMin - 1 <= symbol.col &&
  symbol.col <= number.colMax + 1;

// Part 1
const sum = numbers
  .filter((number) =>
    symbols.reduce((isOneSymbolAdjacent, symbol) => isOneSymbolAdjacent || isAdjacent(symbol, number), false)
  )
  .reduce((sum, number) => sum + number.value, 0);

console.log(sum);

// Part 2
const ratio = symbols
  .filter((symbol) => symbol.value == "*")
  .map((symbol) =>
    numbers.reduce(
      (adjacentNumbers, number) => [...adjacentNumbers, ...(isAdjacent(symbol, number) ? [number] : [])],
      [] as Number[]
    )
  )
  .filter((adjacentNumbers) => adjacentNumbers.length == 2)
  .map(([number1, number2]) => number1.value * number2.value)
  .reduce((sum, power) => sum + power, 0);

console.log(ratio);
