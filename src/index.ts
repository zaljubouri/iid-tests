#!/usr/bin/env node
import yargs from 'yargs';
import fs from 'fs';
import { IidTestName } from './IidTestName';
import { IidTestMethods } from './IidTestMethods';

const argv = yargs(process.argv.slice(2))
  .usage('Usage: $0 -f [filename.csv]')
  .options({ f: { type: 'string', demandOption: true }, r: { type: 'boolean' } })
  .help('h')
  .alias({ v: 'version', f: 'file', r: 'results', h: 'help' })
  .nargs('f', 1)
  .describe({
    f: 'Load a .csv containing a sequential dataset of numbers',
    r: 'Show results of each statistical test',
  })
  .demandOption(['file']).argv;

type TestResult = {
  testName: string;
  pass: boolean;
  counterZero: number;
  counterOne: number;
};

const main = () => {
  let file: string;

  try {
    file = fs.readFileSync(argv.f, 'utf8');
  } catch (err) {
    console.error(err.message);
    return;
  }

  const values = file.split(',').map(Number);
  const sampleSize = values.length;
  console.log(`Given dataset size is ${sampleSize}.`);
  if (values.length < 1000000)
    console.warn('A sample containing less than 1,000,000 numbers may give inaccurate results.');

  const counterZero: Record<string, number> = {};
  const counterOne: Record<string, number> = {};
  const testStatisticsOriginal: Record<string, number> = runTests(values);
  const testResults: TestResult[] = [];

  Object.values(IidTestName).forEach((iidTestName) => {
    counterZero[iidTestName] = 0;
    counterOne[iidTestName] = 0;
  });

  console.time('Time taken to complete permutation tests');

  for (let i = 0; i < 10000; i++) {
    const shuffledArray = IidTestMethods.shuffleArray(values);
    const shuffledArrayTestStatistics = runTests(shuffledArray);

    Object.values(IidTestName).forEach((iidTestName) => {
      if (shuffledArrayTestStatistics[iidTestName] > testStatisticsOriginal[iidTestName])
        counterZero[iidTestName] += 1;
      if (shuffledArrayTestStatistics[iidTestName] === testStatisticsOriginal[iidTestName])
        counterOne[iidTestName] += 1;
    });

    if (process.stdout.isTTY) {
      process.stdout.cursorTo(0);
      process.stdout.write(`${i + 1} / 10000 arrays tested`);
    }
  }

  process.stdout.write('\n');
  console.timeEnd('Time taken to complete permutation tests');

  let isDataIid = true;

  Object.values(IidTestName).forEach((iidTestName) => {
    const testResult = {
      testName: iidTestName,
      pass: true,
      counterZero: counterZero[iidTestName],
      counterOne: counterOne[iidTestName],
    };

    if (counterZero[iidTestName] + counterOne[iidTestName] <= 5) {
      testResult.pass = false;
      isDataIid = false;
    } else if (counterZero[iidTestName] >= 9995) {
      testResult.pass = false;
      isDataIid = false;
    }

    testResults.push(testResult);
  });

  if (argv.r) {
    console.table(testResults);
  }

  console.log(
    `Data ${isDataIid ? 'can' : 'cannot'} be assumed to be independent and identically distributed.`
  );
};

const runTests = (values: number[]): Record<string, number> => {
  const testStatisticsResults: Record<string, number> = {};

  Object.values(IidTestName).forEach((iidTestName) => {
    testStatisticsResults[iidTestName] = IidTestMethods.runTest(iidTestName as IidTestName, values);
  });

  return testStatisticsResults;
};

main();
