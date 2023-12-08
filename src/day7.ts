import * as fs from "fs";

const inputs = fs
  .readFileSync("inputs/day7.txt", "utf8")
  .split("\n")
  .filter((value) => value.length);

// Parse inputs
const hands = inputs
  .map((input) => input.match(/([2-9TJQKA]{5})\s+(\d+)/)!)
  .map(([_, hand, bid]) => ({
    hand: Array.from(hand),
    bid: parseInt(bid),
  }));

console.log(hands);

// Utils
const arrayEquals = <T>(array1: T[], array2: T[]) => array1.join("") === array2.join("");

// Part 1
const sum = hands
  .map(({ hand, bid }) => ({
    hand,
    counts: Object.values(
      hand.reduce((agg, val) => ({ ...agg, [val]: (agg[val] ?? 0) + 1 }), {} as Record<string, number>)
    ).sort(),
    bid,
  }))
  .map(({ hand, counts, bid }) => ({
    hand: hand.map((chr) => (isNaN(parseInt(chr)) ? 10 + ["T", "J", "Q", "K", "A"].indexOf(chr) : parseInt(chr))),
    force: arrayEquals(counts, [5])
      ? 7
      : arrayEquals(counts, [1, 4])
      ? 6
      : arrayEquals(counts, [2, 3])
      ? 5
      : arrayEquals(counts, [1, 1, 3])
      ? 4
      : arrayEquals(counts, [1, 2, 2])
      ? 3
      : arrayEquals(counts, [1, 1, 1, 2])
      ? 2
      : 1,
    bid,
  }))
  .sort(
    (hand1, hand2) =>
      hand1.force - hand2.force || hand1.hand.map((val, index) => val - hand2.hand[index]).find((val) => val !== 0)!
  )
  .map(({ bid }, index) => bid * (index + 1))
  .reduce((agg, val) => agg + val, 0);

console.log(sum);

// Part 2
const sum2 = hands
  .map(({ hand, bid }) => ({
    hand,
    counts: Object.values(
      hand.reduce((agg, val) => ({ ...agg, [val]: (agg[val] ?? 0) + 1 }), {} as Record<string, number>)
    ).sort(),
    jokerCount: hand.filter((chr) => chr === "J").length,
    bid,
  }))
  .map(({ hand, counts, jokerCount, bid }) => ({
    hand: hand.map((chr) =>
      chr === "J" ? 1 : isNaN(parseInt(chr)) ? 10 + ["T", "Q", "K", "A"].indexOf(chr) : parseInt(chr)
    ),
    force: arrayEquals(counts, [5])
      ? 7
      : arrayEquals(counts, [1, 4])
      ? jokerCount
        ? 7
        : 6
      : arrayEquals(counts, [2, 3])
      ? jokerCount
        ? 7
        : 5
      : arrayEquals(counts, [1, 1, 3])
      ? jokerCount
        ? 6
        : 4
      : arrayEquals(counts, [1, 2, 2])
      ? jokerCount === 2
        ? 6
        : jokerCount === 1
        ? 5
        : 3
      : arrayEquals(counts, [1, 1, 1, 2])
      ? jokerCount
        ? 4
        : 2
      : jokerCount
      ? 2
      : 1,
    bid,
  }))
  .sort(
    (hand1, hand2) =>
      hand1.force - hand2.force || hand1.hand.map((val, index) => val - hand2.hand[index]).find((val) => val !== 0)!
  )
  .map(({ bid }, index) => bid * (index + 1))
  .reduce((agg, val) => agg + val, 0);

console.log(sum2);
