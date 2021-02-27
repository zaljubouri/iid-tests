#!/usr/bin/env node
import fs from 'fs';
import os from 'os';
import { Pool, spawn, Transfer, Worker } from 'threads';
import { QueuedTask } from 'threads/dist/master/pool';
import { deserialize } from 'v8';
import yargs from 'yargs';

import { IidTestName } from './IidTestName';
import { IidTestWorker } from './workers/IidTestWorker';

const argv = yargs(process.argv.slice(2))
  .usage('Usage: $0 -f [file]')
  .options({
    f: { type: 'string', demandOption: true },
    m: { type: 'boolean' },
    o: { type: 'boolean' },
    r: { type: 'boolean' },
    t: { type: 'number' },
  })
  .help('h')
  .alias({
    f: 'file',
    h: 'help',
    m: 'multithread',
    o: 'original',
    r: 'results',
    t: 'threads',
    v: 'version',
  })
  .nargs({ f: 1, t: 1 })
  .describe({
    f: 'Load a file containing a comma-separated sequential dataset of numbers',
    m: `Use all threads available to run the tests; this will override any value set by the -t --threads option`,
    o: 'Show results of the individual statistical tests on the original dataset',
    r: 'Show overall results for each statistical test',
    t: `Specify number of CPU threads you wish to use to run the tests; default is half the CPU's thread count`,
  })
  .demandOption(['file']).argv;

type TestResult = {
  testName: string;
  pass: boolean;
  counterZero: number;
  counterOne: number;
};

const main = async () => {
  let threads: number;

  const threadsMax = os.cpus().length;
  if (argv.m) threads = threadsMax;
  else if (argv.t) threads = argv.t > threadsMax ? threadsMax : argv.t;
  else threads = Math.ceil(threadsMax / 2);

  console.log(`Using ${threads} / ${threadsMax} threads.`);

  let file: string;

  try {
    file = fs.readFileSync(argv.f, 'utf8');
  } catch (err) {
    console.error(err.message);
    return;
  }

  const values = file.split(',').map(Number);
  const sampleSize = values.length;
  console.log(`Given dataset size is ${sampleSize.toLocaleString()}.`);
  if (values.length < 1000000)
    console.warn('A sample containing less than 1,000,000 numbers may give inaccurate results.');

  const counterZero: Record<string, number> = {};
  const counterOne: Record<string, number> = {};

  const pool = Pool(() => spawn<IidTestWorker>(new Worker('./workers/IidTestWorker')), threads);

  const uint16Values = Uint32Array.from(values);
  const testStatisticsOriginal = await pool.queue(
    async (testRunner) =>
      await testRunner.runTests(Transfer(uint16Values.buffer, [uint16Values.buffer]))
  );
  const deserializedTestStatisticsOriginal = deserialize(new Uint8Array(testStatisticsOriginal));
  if (argv.o) console.table(deserializedTestStatisticsOriginal);

  Object.values(IidTestName).forEach((iidTestName) => {
    counterZero[iidTestName] = 0;
    counterOne[iidTestName] = 0;
  });

  let loadingBreakpoint = 10;
  if (sampleSize < 1000000) loadingBreakpoint = 25;
  if (sampleSize < 500000) loadingBreakpoint = 50;
  if (sampleSize < 250000) loadingBreakpoint = 100;
  if (process.stdout.isTTY) {
    process.stdout.cursorTo(0);
    process.stdout.write(`0 / 10,000 arrays completed`);
  }
  console.time('Time taken to complete permutation tests');

  const iidTestTasks: QueuedTask<any, any>[] = [];

  for (let i = 0; i < 10000; i++) {
    const shuffledArray = await pool.queue(async (testRunner) => {
      const uint16ValuesToShuffle = Uint32Array.from(values);
      return await testRunner.shuffleArray(
        Transfer(uint16ValuesToShuffle.buffer, [uint16ValuesToShuffle.buffer])
      );
    });
    iidTestTasks.push(
      pool.queue(async (testRunner) => {
        const uint16ShuffledValues = new Uint32Array(shuffledArray);
        return await testRunner.runTests(
          Transfer(uint16ShuffledValues.buffer, [uint16ShuffledValues.buffer])
        );
      })
    );
    if (i % loadingBreakpoint === 0) {
      if (process.stdout.isTTY) {
        process.stdout.cursorTo(0);
        process.stdout.write(`${i.toLocaleString()} / 10,000 arrays completed`);
      }
    }
  }

  await Promise.all(iidTestTasks);
  for (let i = 0; i < iidTestTasks.length; i++) {
    iidTestTasks[i].then((shuffledArrayStatistics) => {
      const deserialisedShuffledArrayStatistics = deserialize(
        new Uint8Array(shuffledArrayStatistics)
      );
      if (i % 1000 === 0) console.table(deserialisedShuffledArrayStatistics);
      Object.values(IidTestName).forEach((iidTestName) => {
        if (
          deserialisedShuffledArrayStatistics[iidTestName] >
          deserializedTestStatisticsOriginal[iidTestName]
        )
          counterZero[iidTestName] += 1;
        if (
          deserialisedShuffledArrayStatistics[iidTestName] ===
          deserializedTestStatisticsOriginal[iidTestName]
        )
          counterOne[iidTestName] += 1;
      });
    });
  }

  await pool.terminate();

  if (process.stdout.isTTY) process.stdout.write('\n');
  console.timeEnd('Time taken to complete permutation tests');

  const testResults: TestResult[] = [];
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
    `The data ${isDataIid ? 'can' : 'cannot'} be assumed to be independent ${
      isDataIid ? 'and' : 'or'
    } identically distributed.`
  );
};

main();
