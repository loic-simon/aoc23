import * as fs from "fs";

const inputs = fs
  .readFileSync("inputs/day6.txt", "utf8")
  .split("\n")
  .filter((value) => value.length);

// Parse inputs
const [rawTimes, rawDistances] = inputs;

// Part 1
const times = Array.from(rawTimes.matchAll(/\d+/g)).map(([val]) => parseInt(val));
const distances = Array.from(rawDistances.matchAll(/\d+/g)).map(([val]) => parseInt(val));
const races = times.map((time, index) => ({
  time,
  bestDistance: distances[index],
}));
console.log({ races });

const sum = races
  .map(
    ({ time, bestDistance }) =>
      [...Array(time + 1).keys()].filter((holdTime) => holdTime * (time - holdTime) > bestDistance).length
  )
  .reduce((agg, winningCount) => agg * winningCount);

console.log(sum);

// Part 2
const time = parseInt(rawTimes.replace(/\D/g, ""));
const bestDistance = parseInt(rawDistances.replace(/\D/g, ""));

const answer = [...Array(time + 1).keys()].filter((holdTime) => holdTime * (time - holdTime) > bestDistance).length;
console.log(answer);
