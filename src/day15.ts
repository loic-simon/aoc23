import * as fs from "fs";

const inputs = fs
  .readFileSync("inputs/day15.txt", "utf8")
  .split("\n")
  .filter((value) => value.length);

// Parse inputs
const [input] = inputs;
const patterns = input.split(",");

console.log(patterns);

// Part 1
const HASH = (pattern: string) => pattern.split("").reduce((hash, chr) => ((hash + chr.charCodeAt(0)) * 17) % 256, 0);

const sum = patterns.map(HASH).reduce((agg, val) => agg + val, 0);
console.log(sum);

// Part 2
type Lens = { label: string; focal: number };

const addLens = (boxes: Lens[][], [_, label, focal]: string[]) =>
  boxes.map((box, i) =>
    i === HASH(label)
      ? box.some((lens) => lens.label === label)
        ? box.map((lens) =>
            lens.label === label ? { label, focal: parseInt(focal) } : { label: lens.label, focal: lens.focal }
          )
        : [...boxes[HASH(label)], { label, focal: parseInt(focal) }]
      : box
  );

const removeLens = (boxes: Lens[][], [_, label]: string[]) =>
  boxes.map((box, i) => (i === HASH(label) ? box.filter((lens) => lens.label !== label) : box));

const totalPower = patterns
  .reduce(
    (boxes, pattern) =>
      pattern.includes("=")
        ? addLens(boxes, pattern.match(/^(\w+)=(\d)$/)!)
        : removeLens(boxes, pattern.match(/^(\w+)-$/)!),
    [...Array(256)].map((_) => []) as Lens[][]
  )
  .map((lenses, iBox) => lenses.reduce((power, { focal }, iLens) => power + (1 + iBox) * (1 + iLens) * focal, 0))
  .reduce((boxPower, power) => boxPower + power, 0);

console.log(totalPower);
