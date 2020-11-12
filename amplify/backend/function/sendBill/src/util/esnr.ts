const checkSumMatrix = [
  [0, 9, 4, 6, 8, 2, 7, 1, 3, 5],
  [9, 4, 6, 8, 2, 7, 1, 3, 5, 0],
  [4, 6, 8, 2, 7, 1, 3, 5, 0, 9],
  [6, 8, 2, 7, 1, 3, 5, 0, 9, 4],
  [8, 2, 7, 1, 3, 5, 0, 9, 4, 6],
  [2, 7, 1, 3, 5, 0, 9, 4, 6, 8],
  [7, 1, 3, 5, 0, 9, 4, 6, 8, 2],
  [1, 3, 5, 0, 9, 4, 6, 8, 2, 7],
  [3, 5, 0, 9, 4, 6, 8, 2, 7, 1],
  [5, 0, 9, 4, 6, 8, 2, 7, 1, 3],
];

const checkDigits = [0, 9, 8, 7, 6, 5, 4, 3, 2, 1];

const staticRef = '3023211899504000';

const findNextCheckNumber = (nextDigit: number, lastCheckDigit: number): number => {
  return checkSumMatrix[lastCheckDigit][nextDigit];
};

export const calcESNR = (ref: string): string => {
  let initDigit = 0;
  return staticRef + ref + checkDigits[
      (staticRef + ref).split('')
                       .map(digit => Number(digit))
                       .reduce((acc, nextDigit) => acc = findNextCheckNumber(nextDigit, acc), initDigit)
      ];
};
