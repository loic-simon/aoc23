import * as fs from "fs";
import util from "util";

const inputs = fs
  .readFileSync("inputs/day2.txt", "utf8")
  .split("\n")
  .filter((value) => value.length);

// Parse inputs
type Color = "red" | "green" | "blue";
type Game = {
  gameId: number;
  picks: Record<Color, number>[];
};

const games: Game[] = inputs
  .map((input) => input.match(/Game (\d+): (.+)/)!)
  .map(([_, gameId, picks]) => ({
    gameId: parseInt(gameId),
    picks: picks.split(";").map((pick) =>
      pick
        .split(",")
        .map((cubeInfo) => cubeInfo.match(/\s*(\d+) (\w+)\s*/)!)
        .reduce(
          (cubes, [_, count, color]) => ({
            ...cubes,
            [color]: parseInt(count),
          }),
          { red: 0, green: 0, blue: 0 }
        )
    ),
  }));

console.log(util.inspect(games, false, null, true));

// Part 1
const CUBES = { red: 12, green: 13, blue: 14 };
const sum = games
  .filter((game) =>
    game.picks.reduce(
      (allPicksOk, pick) =>
        allPicksOk &&
        Object.entries(pick).reduce((allCubesOk, [color, count]) => allCubesOk && count <= CUBES[color as Color], true),
      true
    )
  )
  .reduce((acc, game) => acc + game.gameId, 0);

console.log(sum);

// Part 2
const power = games
  .map((game) =>
    game.picks.reduce(
      (minimalCubes, pick) => ({
        ...minimalCubes,
        ...Object.entries(pick).reduce(
          (cubesHigherThanMinimal, [color, count]) => ({
            ...cubesHigherThanMinimal,
            ...(count > minimalCubes[color as Color] ? { [color]: count } : {}),
          }),
          {}
        ),
      }),
      { red: 0, green: 0, blue: 0 }
    )
  )
  .map((minimalCubes) => minimalCubes["red"] * minimalCubes["green"] * minimalCubes["blue"])
  .reduce((totalPower, power) => totalPower + power, 0);

console.log(power);
