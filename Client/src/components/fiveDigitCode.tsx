const fiveDigitCode = <T extends number>(min: T, max: T) => {
  // always generate a 5-digit code
  if (!min) return;
  if (!max) return;
  const code: number = Math.floor(Math.random() * (max - min + 1) + min);
  // shorter syntax is: Math.floor(Math.random() * max) + min;
  return code;
};

export default fiveDigitCode;
