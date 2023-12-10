import * as fs from "fs";

const inputs = fs
  .readFileSync("inputs/day8.txt", "utf8")
  .split("\n")
  .filter((value) => value.length);

// Parse inputs
const [rawSequence, ...rawNodes] = inputs;
const sequence = rawSequence.split("").map((chr) => (chr == "L" ? "left" : "right"));
const nodes = rawNodes
  .map((rawNode) => rawNode.match(/([A-Z]{3}) = \(([A-Z]{3}), ([A-Z]{3})\)/)!)
  .reduce(
    (agg, [_, node, left, right]) => ({ ...agg, [node]: { left, right } }),
    {} as Record<string, { left: string; right: string }>
  );

console.log(sequence, nodes);

// Part 1
let currentNode = "AAA";
let i = 0;
const n = sequence.length;
while (currentNode !== "ZZZ") {
  currentNode = nodes[currentNode][sequence[i % n]];
  i++;
}

console.log(i);

// Part 2
let currentNodes = Object.keys(nodes).filter((node) => node[2] === "A");
const nodesInfo = currentNodes
  .map((node) => {
    currentNode = node;
    i = 0;
    let history = [{ node: currentNode, step: 0 }];
    let zSteps = [];
    while (true) {
      currentNode = nodes[currentNode][sequence[i % n]];
      i++;
      if (currentNode[2] === "Z") zSteps.push(i);
      const existingStep = history.findIndex((elt) => elt.node == currentNode && elt.step == i % n);
      if (existingStep >= 0) return { loopStart: existingStep, loopEnd: i, zSteps };
      history.push({ node: currentNode, step: i % n });
    }
  })
  .map(
    ({ loopStart, loopEnd, zSteps }) =>
      (threshold: number) =>
        Math.min(
          ...zSteps.map(
            (zStep) => zStep + (loopEnd - loopStart) * Math.ceil((threshold - zStep) / (loopEnd - loopStart))
          )
        )
  );

let threshold = 1;
while (true) {
  const nextZeros = nodesInfo.map((nextZero) => nextZero(threshold));
  threshold = Math.max(...nextZeros);
  if (nextZeros.every((elt) => elt === threshold)) break;
}

console.log(threshold);
