import * as fs from "fs";

const inputs = fs
  .readFileSync("inputs/day12.txt", "utf8")
  .split("\n")
  .filter((value) => value.length);

// Parse inputs
const rows = inputs
  .map((row) => row.split(" "))
  .map(([streams, counts]) => ({
    streams: streams.split(""),
    groups: counts.split(",").map((chr) => parseInt(chr)),
  }));

console.log(rows);

// Utils
const isEqual = (arr1: number[], arr2: number[]) =>
  arr1.length === arr2.length && arr1.every((item, i) => item === arr2[i]);

// Part 1
const sum = rows
  .map(({ streams, groups }) => ({
    streams,
    groups,
    marks: streams.filter((stream) => stream === "?").length,
  }))
  .map(
    ({ streams, groups, marks }) =>
      [...Array(2 ** marks).keys()]
        .map((i) =>
          streams
            .reduce(
              ({ markCount, completedStreams }, stream) => ({
                markCount: markCount + (stream === "?" ? 1 : 0),
                completedStreams: [...completedStreams, stream === "?" ? (i & (2 ** markCount) ? "#" : ".") : stream],
              }),
              { markCount: 0, completedStreams: [] as string[] }
            )
            .completedStreams.reduce(
              ({ currentGroup, completedGroups }, stream) => ({
                currentGroup: stream,
                completedGroups:
                  stream === "#"
                    ? currentGroup === "#"
                      ? [...completedGroups.slice(0, -1), completedGroups[completedGroups.length - 1] + 1]
                      : [...completedGroups, 1]
                    : completedGroups,
              }),
              { currentGroup: "", completedGroups: [] as number[] }
            )
        )
        .filter(({ completedGroups }) => isEqual(completedGroups, groups)).length
  )
  .reduce((agg, val) => agg + val, 0);

console.log(sum);
