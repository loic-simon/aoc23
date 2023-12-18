import * as fs from "fs";

const inputs = fs
  .readFileSync("inputs/day14.sample.txt", "utf8")
  .split("\n")
  .filter((value) => value.length);

// Parse inputs
const rows = inputs.reduce(
  (transposed, line) => transposed.map((row, c) => row + line[c]),
  Array.from(inputs[0]).map(() => "")
);

// Part 1
const sum = rows
  .map((row) => row.replace(/[\.O]+/g, (sub) => Array.from(sub).sort().reverse().join("")))
  .map((row) =>
    Array.from(row)
      .map((chr, i) => (chr === "O" ? row.length - i : 0))
      .reduce((agg, val) => agg + val, 0)
  )
  .reduce((agg, val) => agg + val, 0);

console.log(sum);
