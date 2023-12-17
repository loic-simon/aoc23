import * as fs from "fs";

const inputBlocks = fs
  .readFileSync("inputs/day13.txt", "utf8")
  .split("\n\n")
  .map((lines) => lines.split("\n").filter((value) => value.length));

// Parse inputs
const patterns = inputBlocks; //.map((rows) => rows.join("\n"));
console.log(patterns);

// Part 1
const getIsAxis = (pattern: string[], endOfFirstBlock: number) =>
  pattern.every((line, i) => [line, undefined].includes(pattern[endOfFirstBlock + (endOfFirstBlock - i) + 1]));

const transpose = (pattern: string[]) =>
  pattern.reduce(
    (transposed, line) => transposed.map((row, c) => row + line[c]),
    Array.from(pattern[0]).map(() => "")
  );

const findAxis = (pattern: string[]) => ({
  horizontalAxis: [...Array(pattern.length - 1).keys()]
    .map((endOfFirstBlock) => ({ endOfFirstBlock, isAxis: getIsAxis(pattern, endOfFirstBlock) }))
    .filter(({ isAxis }) => isAxis)
    .map(({ endOfFirstBlock }) => endOfFirstBlock),
  verticalAxis: [...Array(pattern[0].length - 1).keys()]
    .map((endOfFirstBlock) => ({
      endOfFirstBlock,
      isAxis: getIsAxis(transpose(pattern), endOfFirstBlock),
    }))
    .filter(({ isAxis }) => isAxis)
    .map(({ endOfFirstBlock }) => endOfFirstBlock),
});

const originalAxis = patterns.map((pattern) => findAxis(pattern));
const sum = originalAxis
  .map(({ verticalAxis, horizontalAxis }) =>
    verticalAxis.length ? verticalAxis[0] + 1 : (horizontalAxis[0] + 1) * 100
  )
  .reduce((agg, val) => agg + val, 0);

console.log(sum);

// Part 2
const sum2 = patterns
  .map(
    (pattern, n) =>
      pattern
        .reduce(
          (fixedPatterns, row, i) => [
            ...fixedPatterns,
            ...Array.from(row).map((_, j) =>
              pattern.map((r, i_) =>
                i_ === i
                  ? Array.from(row)
                      .map((c, j_) => (j_ === j ? (c === "." ? "#" : ".") : c))
                      .join("")
                  : r
              )
            ),
          ],
          [] as string[][]
        )
        .map((fixedPattern) => findAxis(fixedPattern))
        .map(({ verticalAxis, horizontalAxis }) => ({
          verticalAxis: verticalAxis.filter((ix) => !originalAxis[n].verticalAxis.includes(ix)),
          horizontalAxis: horizontalAxis.filter((ix) => !originalAxis[n].horizontalAxis.includes(ix)),
        }))
        .find(({ verticalAxis, horizontalAxis }) => verticalAxis.length || horizontalAxis.length)!
  )
  .map(({ verticalAxis, horizontalAxis }) =>
    verticalAxis.length ? verticalAxis[0] + 1 : (horizontalAxis[0] + 1) * 100
  )
  .reduce((agg, val) => agg + val, 0);

console.log(sum2);
