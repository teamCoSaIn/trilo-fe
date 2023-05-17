const swap = <T>(arr: T[], idx1: number, idx2: number) => {
  [arr[idx1], arr[idx2]] = [arr[idx2], arr[idx1]];
};

export default swap;
