import * as fs from "fs";

const inputs = fs
  .readFileSync("inputs/day11.txt", "utf8")
  .split("\n")
  .filter((value) => value.length);

// Parse inputs
const universe = inputs.map((row) => row.split("").map((chr) => chr === "#"));

console.log(universe);

// Part 1
const emptyLines = universe
  .map((row, i) => ({ row, i }))
  .filter(({ row }) => row.every((isGalaxy) => !isGalaxy))
  .map(({ i }) => i);
const notEmptyColumns = universe
  .flatMap((row) => row.flatMap((isGalaxy, j) => ({ j, isGalaxy })))
  .reduce((agg, { j, isGalaxy }) => [...agg, ...(isGalaxy && !agg.includes(j) ? [j] : [])], [] as number[]);

const expandedUniverse = universe
  .map((row) =>
    row.reduce((agg, chr, j) => [...agg, ...(!notEmptyColumns.includes(j) ? [chr, chr] : [chr])], [] as boolean[])
  )
  .reduce((agg, row, i) => [...agg, ...(emptyLines.includes(i) ? [row, row] : [row])], [] as boolean[][]);

const expandedGalaxies = expandedUniverse
  .flatMap((row, i) => row.flatMap((isGalaxy, j) => ({ i, j, isGalaxy })))
  .filter(({ isGalaxy }) => isGalaxy);
const sum = expandedGalaxies
  .flatMap(({ i: i1, j: j1 }, n1) =>
    expandedGalaxies.filter((_, n2) => n2 > n1).map(({ i, j }) => Math.abs(i - i1) + Math.abs(j - j1))
  )
  .reduce((agg, val) => agg + val, 0);

console.log(sum);

// Part 2
const expansion = 1000000;
const linesMetric = [...Array(universe.length).keys()].reduce(
  ({ emptyLinesCount, matrix }, i) => ({
    emptyLinesCount: emptyLinesCount + (emptyLines.includes(i) ? 1 : 0),
    matrix: [...matrix, (matrix?.[i - 1] || 0) + (emptyLines.includes(i) ? expansion : 1)],
  }),
  { emptyLinesCount: 0, matrix: [] as number[] }
).matrix;
const columnsMetric = [...Array(universe[0].length).keys()].reduce(
  ({ emptyLinesCount, matrix }, j) => ({
    emptyLinesCount: emptyLinesCount + (!notEmptyColumns.includes(j) ? 1 : 0),
    matrix: [...matrix, (matrix?.[j - 1] || 0) + (!notEmptyColumns.includes(j) ? expansion : 1)],
  }),
  { emptyLinesCount: 0, matrix: [] as number[] }
).matrix;

const galaxies = universe
  .flatMap((row, i) => row.flatMap((isGalaxy, j) => ({ i, j, isGalaxy })))
  .filter(({ isGalaxy }) => isGalaxy);
const sum2 = galaxies
  .flatMap(({ i: i1, j: j1 }, n1) =>
    galaxies
      .filter((_, n2) => n2 > n1)
      .map(({ i, j }) => Math.abs(linesMetric[i] - linesMetric[i1]) + Math.abs(columnsMetric[j] - columnsMetric[j1]))
  )
  .reduce((agg, val) => agg + val, 0);

console.log(sum2);
