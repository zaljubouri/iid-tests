# iid-tests

https://www.npmjs.com/package/iid-tests

A script to run eleven statistical tests which will determine whether a collection of random variables are independent and identically distributed (IID).

This tool is intended to be ran from the CLI using `npx`.

## Usage

Run the tests on a CSV file containing (ideally) 1,000,000+ numbers.

```
Usage: npx iid-tests -f [filename.csv]

Options:
  -f, --file     Load a .csv containing a sequential dataset of numbers
                                                             [string] [required]
  -r, --results  Show results of each statistical test                 [boolean]
  -h, --help     Show help                                             [boolean]
  -v, --version  Show version number                                   [boolean]
```

## Examples

### Typical

```
$ npx iid-tests -f test.csv
Given dataset size is 7.
A sample containing less than 1,000,000 numbers may give inaccurate results.
10000 / 10000 arrays tested
Time taken to complete permutation tests: 1.130s
The data cannot be assumed to be independent and identically distributed.
```

### With tabular results

```
$ npx iid-tests -f test.csv -r
Given dataset size is 532.
A sample containing less than 1,000,000 numbers may give inaccurate results.
10000 / 10000 arrays tested
Time taken to complete permutation tests: 6.508s
┌─────────┬────────────────────────┬───────┬─────────────┬────────────┐
│ (index) │        testName        │ pass  │ counterZero │ counterOne │
├─────────┼────────────────────────┼───────┼─────────────┼────────────┤
│    0    │      'EXCURSION'       │ false │    10000    │     0      │
│    1    │ 'NO_DIRECTIONAL_RUNS'  │ false │    10000    │     0      │
│    2    │ 'LEN_DIRECTIONAL_RUNS' │ true  │    3549     │    4145    │
│    3    │ 'NO_INCREASE_DECREASE' │ false │      0      │     0      │
│    4    │   'LEN_RUNS_MEDIAN'    │ false │    10000    │     0      │
│    5    │    'NO_RUNS_MEDIAN'    │ false │    10000    │     0      │
│    6    │    'AVG_COLLISION'     │ false │      0      │     0      │
│    7    │    'MAX_COLLISION'     │ true  │      0      │    8405    │
│    8    │     'PERIODICITY'      │ false │    10000    │     0      │
│    9    │      'COVARIANCE'      │ false │    9999     │     0      │
│   10    │     'COMPRESSION'      │ false │    10000    │     0      │
└─────────┴────────────────────────┴───────┴─────────────┴────────────┘
The data cannot be assumed to be independent and identically distributed.
```
