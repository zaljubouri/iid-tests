import zlib from 'zlib';

import { IidTestName } from './IidTestName';

export class IidTestMethods {
  static runTest = (iidTestName: IidTestName, values: number[], p?: number): number => {
    switch (iidTestName) {
      case IidTestName.Excursion:
        return IidTestMethods.excursion(values);
      case IidTestName.NumberOfDirectionalRuns:
        return IidTestMethods.noOfDirectionalRuns(values);
      case IidTestName.LengthOfDirectionalRuns:
        return IidTestMethods.lenOfDirectionalRuns(values);
      case IidTestName.NumberOfIncreasesAndDecreases:
        return IidTestMethods.noOfIncreasesAndDecreases(values);
      case IidTestName.NumberOfRunsMedian:
        return IidTestMethods.noOfRunsMedian(values);
      case IidTestName.LengthOfRunsMedian:
        return IidTestMethods.lenOfRunsMedian(values);
      case IidTestName.AverageCollision:
        return IidTestMethods.avgCollision(values);
      case IidTestName.MaxCollision:
        return IidTestMethods.maxCollision(values);
      case IidTestName.Periodicity:
        return IidTestMethods.periodicity(values, p);
      case IidTestName.Covariance:
        return IidTestMethods.covariance(values, p);
      case IidTestName.Compression:
        return IidTestMethods.compression(values);
      default:
        return -1;
    }
  };

  static excursion = (values: number[]): number => {
    const average = values.reduce((total, value) => total + value) / values.length;

    const deviations = [];
    let totalSoFar = 0;

    for (let i = 0; i < values.length; i++) {
      totalSoFar += values[i];
      deviations.push(Math.abs(totalSoFar - (i + 1) * average));
    }

    let max = deviations[0];

    for (let i = 0; i < deviations.length; i++) {
      if (deviations[i] > max) max = deviations[i];
    }

    return max;
  };

  static noOfDirectionalRuns = (values: number[]): number => {
    const temp = [];

    for (let i = 0; i < values.length - 1; i++) {
      if (values[i] > values[i + 1]) temp[i] = -1;
      else temp[i] = 1;
    }

    let currentRun = 1;
    let runCount = 0;
    let i = 0;
    let currentValue = temp[i];

    while (i < values.length) {
      if (currentValue === temp[i]) {
        currentRun += 1;
        if (currentRun === 2) runCount += 1;
      } else {
        currentRun = 1;
      }

      currentValue = temp[i];
      i += 1;
    }

    return runCount;
  };

  static lenOfDirectionalRuns = (values: number[]): number => {
    const temp = [];

    for (let i = 0; i < values.length - 1; i++) {
      if (values[i] > values[i + 1]) temp[i] = -1;
      else temp[i] = 1;
    }

    let currentRun = 1;
    let longestRun = 0;
    let i = 1;
    let currentValue = temp[i];

    while (i < values.length) {
      if (currentValue === temp[i]) {
        currentRun += 1;
      } else {
        if (currentRun > longestRun) longestRun = currentRun;
        currentRun = 1;
      }

      currentValue = temp[i];
      i += 1;
    }

    return longestRun;
  };

  static noOfIncreasesAndDecreases = (values: number[]): number => {
    let noOfOnes = 0;
    let noOfMinusOnes = 0;

    for (let i = 0; i < values.length - 1; i++) {
      if (values[i] > values[i + 1]) noOfMinusOnes += 1;
      else noOfOnes += 1;
    }

    return Math.max(noOfOnes, noOfMinusOnes);
  };

  static noOfRunsMedian = (values: number[]): number => {
    const median = IidTestMethods.calculateMedian(values);
    const temp = [];

    for (let i = 0; i < values.length; i++) {
      if (values[i] < median) temp[i] = -1;
      else temp[i] = 1;
    }

    let currentRun = 1;
    let runCount = 1;
    let i = 0;
    let currentValue = temp[i];

    while (i < values.length) {
      if (currentRun === 1) runCount += 1;
      if (currentValue === temp[i]) {
        currentRun += 1;
      } else {
        currentRun = 1;
      }

      currentValue = temp[i];
      i += 1;
    }

    return runCount;
  };

  static lenOfRunsMedian = (values: number[]): number => {
    const median = IidTestMethods.calculateMedian(values);
    const temp = [];

    for (let i = 0; i < values.length; i++) {
      if (values[i] < median) temp[i] = -1;
      else temp[i] = 1;
    }

    let currentRun = 1;
    let longestRun = 0;
    let i = 0;
    let currentValue = temp[i];

    while (i < values.length) {
      if (currentValue === temp[i]) {
        currentRun += 1;
      } else {
        if (currentRun > longestRun) longestRun = currentRun;
        currentRun = 1;
      }

      currentValue = temp[i];
      i += 1;
    }

    return longestRun;
  };

  static avgCollision = (values: number[]): number => {
    let temp: number[] = [];
    const collisions: number[] = [];

    let i = 0;

    while (i < values.length) {
      if (temp.includes(values[i])) {
        collisions.push(temp.length + 1);
        temp = [];
        i += 1;
        continue;
      }

      temp.push(values[i]);
      i += 1;
    }

    if (collisions.length !== 0) {
      const average = collisions.reduce((total, value) => total + value) / collisions.length;
      return average;
    } else {
      return 0;
    }
  };

  static maxCollision = (values: number[]): number => {
    let temp: number[] = [];
    const collisions: number[] = [];

    let i = 0;

    while (i < values.length) {
      if (temp.includes(values[i])) {
        collisions.push(temp.length + 1);
        temp = [];
        i += 1;
        continue;
      }

      temp.push(values[i]);
      i += 1;
    }

    if (collisions.length !== 0) {
      let max = collisions[0];

      for (let i = 0; i < collisions.length; i++) {
        if (collisions[i] > max) max = collisions[i];
      }

      return max;
    } else {
      return 0;
    }
  };

  static periodicity = (values: number[], p = 2): number => {
    let result = 0;

    for (let i = 0; i < values.length - p; i++) {
      if (values[i] === values[i + p]) result += 1;
    }

    return result;
  };

  static covariance = (values: number[], p = 2): number => {
    let result = 0;

    for (let i = 0; i < values.length - p; i++) {
      result += values[i] * values[i + p];
    }

    return result;
  };

  static compression = (values: number[]): number => {
    const stringValues = Buffer.from(values.join(' '));

    const compressed = zlib.deflateSync(stringValues);

    return compressed.byteLength;
  };

  static shuffleArray = (array: number[]): number[] => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
  };

  private static calculateMedian = (numbers: number[]) => {
    const sorted = numbers.slice().sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);

    if (sorted.length % 2 === 0) {
      return (sorted[middle - 1] + sorted[middle]) / 2;
    }

    return sorted[middle];
  };
}
