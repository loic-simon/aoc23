import * as fs from "fs";

const inputs = fs
  .readFileSync("inputs/day1.txt", "utf8")
  .split("\n")
  .filter((value) => value.length);

// Part 1
const simpleSum = inputs
  .map((input) => input.replace(/\D/g, ""))
  .map((digits) => parseInt(digits[0] + digits[digits.length - 1]))
  .reduce((acc, value) => acc + value, 0);

console.log(simpleSum);

// Part 2
const DIGITS: Record<string, string> = {
  one: "1",
  two: "2",
  three: "3",
  four: "4",
  five: "5",
  six: "6",
  seven: "7",
  eight: "8",
  nine: "9",
};
const complexSum = inputs
  .map((input) => input.matchAll(new RegExp(`(?=(${Object.keys(DIGITS).join("|")}|\\d))`, "g")))
  .map((matches) => Array.from(matches, ([_, val]) => DIGITS?.[val] || val))
  .map((digits) => parseInt(digits[0] + digits[digits.length - 1]))
  .reduce((acc, value) => acc + value, 0);

console.log(complexSum);
