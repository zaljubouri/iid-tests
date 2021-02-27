# iid-tests

https://www.npmjs.com/package/iid-tests

A script to run eleven\* statistical tests which will determine whether a collection of random variables are independent and identically distributed (IID). These tests are specified by the [National Institute of Standards and Technology](https://www.nist.gov/) in [NIST Special Publication 800-90B](https://doi.org/10.6028/NIST.SP.800-90B).

This tool is intended to be ran from the CLI using `npx` and utilises multiple threads (if available) by default.

\* Due to a memory leak issue with zlib, the compression test has been commented out and so this package will only run ten tests.

## Usage

Run the tests on a file containing (ideally) 1,000,000+ numbers separated by commas.

```
Usage: npx iid-tests -f [file]

Options:
  -f, --file         Load a file containing a comma-separated sequential dataset
                     of numbers                              [string] [required]
  -m, --multithread  Use all threads available to run the tests; this will
                     override any value set by the -t --threads option [boolean]
  -o, --original     Show results of the individual statistical tests on the
                     original dataset                                  [boolean]
  -r, --results      Show overall results for each statistical test    [boolean]
  -t, --threads      Specify number of CPU threads you wish to use to run the
                     tests; default is half the CPU's thread count      [number]
  -h, --help         Show help                                         [boolean]
  -v, --version      Show version number                               [boolean]
```

## Examples

### Typical

```
$ npx iid-tests -f test.csv
Using 6 / 12 threads.
Given dataset size is 29,030.
A sample containing less than 1,000,000 numbers may give inaccurate results.
10,000 / 10,000 arrays completed
Time taken to complete permutation tests: 44.191s
The data cannot be assumed to be independent or identically distributed.
```

### With tabular results (singlethreaded)

```
$ npx iid-tests -f test.csv -r -t 1
Using 1 / 12 threads.
Given dataset size is 963,147.
A sample containing less than 1,000,000 numbers may give inaccurate results.
10,000 / 10,000 arrays completed
Time taken to complete permutation tests: 2:43:01.087 (h:mm:ss.mmm)
┌─────────┬────────────────────────┬──────┬─────────────┬────────────┐
│ (index) │        testName        │ pass │ counterZero │ counterOne │
├─────────┼────────────────────────┼──────┼─────────────┼────────────┤
│    0    │      'EXCURSION'       │ true │     518     │     0      │
│    1    │ 'NUM_DIRECTIONAL_RUNS' │ true │    3533     │     8      │
│    2    │ 'LEN_DIRECTIONAL_RUNS' │ true │    3822     │    6091    │
│    3    │ 'NUM_INCREASE_DECREASE'│ true │    7179     │     23     │
│    4    │   'LEN_RUNS_MEDIAN'    │ true │     589     │    504     │
│    5    │    'NUM_RUNS_MEDIAN'   │ true │    7383     │     12     │
│    6    │    'AVG_COLLISION'     │ true │    3399     │     1      │
│    7    │    'MAX_COLLISION'     │ true │    3461     │    125     │
│    8    │     'PERIODICITY'      │ true │    9254     │    143     │
│    9    │      'COVARIANCE'      │ true │    3953     │     0      │
└─────────┴────────────────────────┴──────┴─────────────┴────────────┘
The data can be assumed to be independent and identically distributed.
```

### With tabular results (multithreaded)

```
$ npx iid-tests -f test.csv -r -m
Using 12 / 12 threads.
Given dataset size is 963,147.
A sample containing less than 1,000,000 numbers may give inaccurate results.
10,000 / 10,000 arrays completed
Time taken to complete permutation tests: 46:39.871 (m:ss.mmm)
┌─────────┬────────────────────────┬──────┬─────────────┬────────────┐
│ (index) │        testName        │ pass │ counterZero │ counterOne │
├─────────┼────────────────────────┼──────┼─────────────┼────────────┤
│    0    │      'EXCURSION'       │ true │     551     │     0      │
│    1    │ 'NUM_DIRECTIONAL_RUNS' │ true │    3478     │     11     │
│    2    │ 'LEN_DIRECTIONAL_RUNS' │ true │    3852     │    6078    │
│    3    │ 'NUM_INCREASE_DECREASE'│ true │    7326     │     20     │
│    4    │   'LEN_RUNS_MEDIAN'    │ true │     557     │    514     │
│    5    │    'NUM_RUNS_MEDIAN'   │ true │    7307     │     8      │
│    6    │    'AVG_COLLISION'     │ true │    3564     │     0      │
│    7    │    'MAX_COLLISION'     │ true │    3400     │    114     │
│    8    │     'PERIODICITY'      │ true │    9202     │    165     │
│    9    │      'COVARIANCE'      │ true │    3968     │     0      │
└─────────┴────────────────────────┴──────┴─────────────┴────────────┘
The data can be assumed to be independent and identically distributed.
```
