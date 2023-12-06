import * as fs from "fs";

const inputBlocks = fs
  .readFileSync("inputs/day5.txt", "utf8")
  .split("\n\n")
  .map((lines) => lines.split("\n").filter((value) => value.length));

// Parse inputs
const [
  [rawSeeds],
  [h1, ...rawSeedToSoil],
  [h2, ...rawSoilToFertilizer],
  [h3, ...rawFertilizerToWater],
  [h4, ...rawWaterToLight],
  [h5, ...rawLightToTemperature],
  [h6, ...rawTemperatureToHumidity],
  [h7, ...rawHumidityToLocation],
] = inputBlocks;

type Range = {
  sourceStart: number;
  destStart: number;
  length: number;
};
const seeds = Array.from(rawSeeds.matchAll(/\d+/g)).map(([value]) => parseInt(value));

const parseMap = (rawMap: string[]): Range[] =>
  rawMap
    .map((line) => line.match(/(\d+) (\d+) (\d+)/)!)
    .map(([_, destStart, sourceStart, length]) => ({
      sourceStart: parseInt(sourceStart),
      destStart: parseInt(destStart),
      length: parseInt(length),
    }));
const seedToSoil = parseMap(rawSeedToSoil);
const soilToFertilizer = parseMap(rawSoilToFertilizer);
const fertilizerToWater = parseMap(rawFertilizerToWater);
const waterToLight = parseMap(rawWaterToLight);
const lightToTemperature = parseMap(rawLightToTemperature);
const temperatureToHumidity = parseMap(rawTemperatureToHumidity);
const humidityToLocation = parseMap(rawHumidityToLocation);

// Part 1
const applyMap = (map: Range[], input: number): number => {
  const matchingRange = map.find((range) => range.sourceStart <= input && input < range.sourceStart + range.length);
  return matchingRange ? matchingRange.destStart + (input - matchingRange.sourceStart) : input;
};
const applyMaps = (seeds_: number[]): number[] =>
  seeds_
    .map((seed) => applyMap(seedToSoil, seed))
    .map((soil) => applyMap(soilToFertilizer, soil))
    .map((fertilizer) => applyMap(fertilizerToWater, fertilizer))
    .map((water) => applyMap(waterToLight, water))
    .map((light) => applyMap(lightToTemperature, light))
    .map((temperature) => applyMap(temperatureToHumidity, temperature))
    .map((humidity) => applyMap(humidityToLocation, humidity));

const minLocation = applyMaps(seeds).reduce((min, location) => (location < min ? location : min), Infinity);

console.log(minLocation);
