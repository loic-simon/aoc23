import * as fs from "fs";
import util from "util";

const inputs = fs
  .readFileSync("inputs/day4.txt", "utf8")
  .split("\n")
  .filter((value) => value.length);

// Parse inputs
type Card = {
  id: number;
  winningNumbers: number[];
  myNumbers: number[];
};
const cards: Card[] = inputs
  .map((input) => input.match(/Card\s+(\d+):\s+([\d\s]+?)\s*\|\s*([\d\s]+)/)!)
  .map(([_, id, winningNumbers, myNumbers]) => ({
    id: parseInt(id),
    winningNumbers: winningNumbers.split(/\s+/).map((number) => parseInt(number)),
    myNumbers: myNumbers.split(/\s+/).map((number) => parseInt(number)),
  }));

console.log(util.inspect(cards, false, null, true));

// Part 1
const sum = cards
  .map((card) => card.myNumbers.reduce((count, value) => count + (card.winningNumbers.includes(value) ? 1 : 0), 0))
  .map((winningCount) => (winningCount > 0 ? 2 ** (winningCount - 1) : 0))
  .reduce((agg, winningCount) => agg + winningCount, 0);

console.log(sum);

// Part 2
const help = cards
  .map((card) => ({
    id: card.id,
    winningCount: card.myNumbers.reduce((count, value) => count + (card.winningNumbers.includes(value) ? 1 : 0), 0),
  }))
  .map(({ id, winningCount }) => ({
    id,
    cardsWon: cards.filter((card) => id < card.id && card.id <= id + winningCount).map((card) => card.id),
  }))
  .reduce(
    (cardCopies, { id, cardsWon }) =>
      Object.fromEntries(
        Object.entries(cardCopies).map(([cardId, count]) => [
          cardId,
          count + (cardsWon.includes(parseInt(cardId)) ? cardCopies[id] : 0),
        ])
      ),
    Object.fromEntries(cards.map((card) => [card.id, 1]))
  );
const totalCards = Object.values(help).reduce((acc, value) => acc + value, 0);

console.log(totalCards);
