import * as fs from "fs";

const inputs = fs
  .readFileSync("inputs/day10.txt", "utf8")
  .split("\n")
  .filter((value) => value.length);

// Parse inputs
type Pipe = { N?: boolean; S?: boolean; E?: boolean; W?: boolean; symbol: string };
const SYMBOLS: Record<string, Pipe> = {
  "|": { N: true, S: true, symbol: "│" },
  "-": { W: true, E: true, symbol: "─" },
  L: { N: true, E: true, symbol: "└" },
  J: { N: true, W: true, symbol: "┘" },
  "7": { S: true, W: true, symbol: "┐" },
  F: { S: true, E: true, symbol: "┌" },
  ".": { symbol: " " },
  S: { N: true, S: true, E: true, W: true, symbol: "█" },
};
const pipes = inputs.map((input) => input.split("").map((chr) => SYMBOLS[chr]));

console.log(pipes.map((row) => row.map((pipe) => pipe.symbol).join("")).join("\n"));

// Part 1
const start = pipes
  .reduce(
    (flatPipes, row, i) => [...flatPipes, ...row.map((pipe, j) => ({ i, j, pipe }))],
    [] as { i: number; j: number; pipe: Pipe }[]
  )
  .find(({ pipe }) => pipe.symbol === SYMBOLS.S.symbol)!;

start.pipe.N = pipes[start.i - 1][start.j]?.S;
start.pipe.S = pipes[start.i + 1][start.j]?.N;
start.pipe.E = pipes[start.i][start.j + 1]?.W;
start.pipe.W = pipes[start.i][start.j - 1]?.E;

let { i, j, pipe } = start;
const path = [{ i, j }];

let from = (pipe.S ? "S" : pipe.N ? "N" : "E") as "N" | "S" | "E" | "W";

while (!(path.length > 1 && path[0].i === path[path.length - 1].i && path[0].j === path[path.length - 1].j)) {
  if (pipe.N && from !== "N") {
    i = i - 1;
    from = "S";
  } else if (pipe.S && from !== "S") {
    i = i + 1;
    from = "N";
  } else if (pipe.E && from !== "E") {
    j = j + 1;
    from = "W";
  } else if (pipe.W && from !== "W") {
    j = j - 1;
    from = "E";
  } else {
    throw new Error();
  }
  pipe = pipes[i][j];
  path.push({ i, j });
}

console.log(path);

const isOn = (array: { i: number; j: number }[], i_: number, j_: number) =>
  array.some(({ i, j }) => i === i_ && j === j_);
console.log(pipes.map((row, i) => row.map((pipe, j) => (isOn(path, i, j) ? pipe.symbol : " ")).join("")).join("\n"));

console.log(Math.floor(path.length / 2));
