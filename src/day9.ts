import * as fs from "fs";

const inputs = fs
  .readFileSync("inputs/day9.txt", "utf8")
  .split("\n")
  .filter((value) => value.length);

// Parse inputs
const histories = inputs.map((input) => input.split(/\s+/g).map((val) => parseInt(val)));

console.log(histories);

// Part 1
const reducedHistories = histories
  .map((history) =>
    history.reduce(
      (reducedHistory) => [
        ...reducedHistory,
        reducedHistory[reducedHistory.length - 1].reduce(
          (state, _, i, hist) => [...state, ...(i ? [hist[i] - hist[i - 1]] : [])],
          [] as number[]
        ),
      ],
      [history]
    )
  )
  .map((reducedHistory) => reducedHistory.filter((state) => state.length));

const sum = reducedHistories
  .map((reducedHistory) => reducedHistory.reduceRight((rightValue, state) => rightValue + state[state.length - 1], 0))
  .reduce((agg, val) => agg + val, 0);

console.log(sum);

// Part 2
const sum2 = reducedHistories
  .map((reducedHistory) => reducedHistory.reduceRight((leftValue, state) => state[0] - leftValue, 0))
  .reduce((agg, val) => agg + val, 0);

console.log(sum2);
