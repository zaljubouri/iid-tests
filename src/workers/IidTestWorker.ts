import { serialize } from 'v8';
import { TransferDescriptor } from 'threads';
import { expose, Transfer } from 'threads/worker';
import { IidTestMethods } from '../IidTestMethods';
import { IidTestName } from '../IidTestName';

const iidTestWorker = {
  runTests: (values: any): TransferDescriptor => {
    const numArray = Array.from(new Uint32Array(values));
    const testStatisticsResults: Record<string, number> = {};

    Object.values(IidTestName).forEach((iidTestName) => {
      testStatisticsResults[iidTestName] = IidTestMethods.runTest(
        iidTestName as IidTestName,
        numArray
      );
    });

    const serializedResult = serialize(testStatisticsResults);
    return Transfer(serializedResult.buffer, [serializedResult.buffer]);
  },
  shuffleArray: (values: any): TransferDescriptor => {
    const numArray = Array.from(new Uint32Array(values));
    const shuffledArray = IidTestMethods.shuffleArray(numArray);
    const typedArray = Uint32Array.from(shuffledArray);

    return Transfer(typedArray.buffer, [typedArray.buffer]);
  },
};

export type IidTestWorker = typeof iidTestWorker;

expose(iidTestWorker);
