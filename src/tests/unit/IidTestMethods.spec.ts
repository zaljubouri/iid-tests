import 'chai/register-should';
import { IidTestMethods } from '../../IidTestMethods';

describe('IidStatistics', () => {
  describe('#excursion', () => {
    it('should do an excursion test correctly', () => {
      const input = [2, 15, 4, 10, 9];

      const result = IidTestMethods.excursion(input);

      result.should.equal(6);
    });
  });

  describe('#noOfDirectionalRuns', () => {
    it('should do a number of directional runs test correctly', () => {
      const input = [2, 2, 2, 5, 7, 7, 9, 3, 1, 4, 4];

      const result = IidTestMethods.noOfDirectionalRuns(input);

      result.should.equal(3);
    });
  });

  describe('#lenOfDirectionalRuns', () => {
    it('should do a longest run test correctly', () => {
      const input = [2, 2, 2, 5, 7, 7, 9, 3, 1, 4, 4];

      const result = IidTestMethods.lenOfDirectionalRuns(input);

      result.should.equal(6);
    });
  });

  describe('#noOfIncreasesAndDecreases', () => {
    it('should do number of increases and decreases correctly', () => {
      const input = [2, 2, 2, 5, 7, 7, 9, 3, 1, 4, 4];

      const result = IidTestMethods.noOfIncreasesAndDecreases(input);

      result.should.equal(8);
    });
  });

  describe('#noOfRunsMedian', () => {
    it('should do a number of runs based on median correctly', () => {
      const input = [5, 15, 12, 1, 13, 9, 4];

      const result = IidTestMethods.noOfRunsMedian(input);

      result.should.equal(5);
    });
  });

  describe('#lenOfRunsMedian', () => {
    it('should do a median longest run test correctly', () => {
      const input = [5, 15, 12, 1, 13, 9, 4];

      const result = IidTestMethods.lenOfRunsMedian(input);

      result.should.equal(2);
    });
  });

  describe('#avgCollision', () => {
    const tests = [
      { input: [2, 1, 1, 2, 0, 1, 0, 1, 1, 2], expected: 3 },
      { input: [0, 1, 3, 1, 2, 4, 3, 3, 1, 2], expected: 4 },
    ];

    tests.forEach((test) => {
      it('should do an average collision test correctly', () => {
        const result = IidTestMethods.avgCollision(test.input);

        result.should.equal(test.expected);
      });
    });
  });

  describe('#maxCollision', () => {
    const tests = [
      { input: [2, 1, 1, 2, 0, 1, 0, 1, 1, 2], expected: 4 },
      { input: [0, 1, 3, 1, 2, 4, 3, 3, 1, 2], expected: 4 },
    ];

    tests.forEach((test) => {
      it('should do a max collision test correctly', () => {
        const result = IidTestMethods.maxCollision(test.input);

        result.should.equal(test.expected);
      });
    });
  });

  describe('#periodicity', () => {
    const tests = [{ input: [2, 1, 2, 1, 0, 1, 0, 1, 1, 2], expected: 5 }];

    tests.forEach((test) => {
      it('should do a periodicity test correctly', () => {
        const result = IidTestMethods.periodicity(test.input);

        result.should.equal(test.expected);
      });
    });
  });

  describe('#covariance', () => {
    const tests = [{ input: [5, 2, 6, 10, 12, 3, 1], expected: 164 }];

    tests.forEach((test) => {
      it('should do a covariance test correctly', () => {
        const result = IidTestMethods.covariance(test.input);

        result.should.equal(test.expected);
      });
    });
  });

  describe('#compression', () => {
    const tests = [{ input: [144, 21, 139, 0, 0, 15], expected: 23 }];

    tests.forEach((test) => {
      it('should do a compression test correctly', () => {
        const result = IidTestMethods.compression(test.input);

        result.should.equal(test.expected);
      });
    });
  });
});
