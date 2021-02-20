import 'chai/register-should';
import { EntropyEstimationMethods } from '../../EntropyEstimationMethods';

describe('IidStatistics', () => {
  describe('#mostCommonValue', () => {
    it('should calculate most common value estimate correctly', () => {
      const input = [0, 1, 1, 2, 0, 1, 2, 2, 0, 1, 0, 1, 1, 0, 2, 2, 1, 0, 2, 1];

      const result = EntropyEstimationMethods.mostCommonValue(input);

      result.should.equal(0.5363);
    });
  });

  describe('#tTuple', () => {
    it('should calculate tTuple estimate correctly', () => {
      const input = [2, 2, 0, 1, 0, 2, 0, 1, 2, 1, 2, 0, 1, 2, 1, 0, 0, 1, 0, 0, 0];

      const result = EntropyEstimationMethods.tTuple(input);

      result.should.equal(0.273);
    });
  });
});
