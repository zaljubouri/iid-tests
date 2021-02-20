import { EntropyEstimationName } from './EntropyEstimationName';

export class EntropyEstimationMethods {
  static runEntropyEstimation = (
    entropyEstimationName: EntropyEstimationName,
    values: number[]
  ): number => {
    switch (entropyEstimationName) {
      case EntropyEstimationName.MostCommonValue:
        return EntropyEstimationMethods.mostCommonValue(values);
      case EntropyEstimationName.tTuple:
        return EntropyEstimationMethods.tTuple(values);
      default:
        return -1;
    }
  };

  static mostCommonValue = (values: number[]): number => {
    const modeAndCount = EntropyEstimationMethods.calculateMode(values);

    const probMode = modeAndCount[1] / values.length;
    const upperBound = Math.min(
      1,
      probMode + 2.576 * Math.sqrt((probMode * (1 - probMode)) / (values.length - 1))
    );

    const minEntropy = -1 * Math.log2(upperBound);

    return parseFloat(minEntropy.toFixed(4));
  };

  static tTuple = (values: number[]): number => {
    const modeAndCount = EntropyEstimationMethods.calculateMode(values, true);

    return 0;
  };

  private static calculateMode = (numbers: number[], largest = false) => {
    const count: Record<number, number> = {};
    let mode: number[] = [];
    let max = 0;
    for (let i = 0; i < numbers.length; i++) {
      const value = numbers[i];

      if (!(value in count)) {
        count[value] = 0;
      }

      count[value]++;

      if (count[value] === max) {
        mode.push(value);
      } else if (count[value] > max) {
        max = count[value];
        mode = [value];
      }
    }

    if (largest) return [mode[mode.length - 1], count[mode[mode.length - 1]]];

    return [mode[0], count[mode[0]]];
  };
}
