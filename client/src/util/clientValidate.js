export default {
  validateNodeValueRange(minValue, maxValue) {
    let errorString = "";
    if (minValue > maxValue) {
      errorString = 'The minimum threshold for the factory is higher than the maximum threshold.';
    } else if (!(Number.isInteger(minValue) && Number.isInteger(maxValue))) {
      errorString = 'The maximum and minimum threshold values must be integers.';
    }
    return errorString;
  },
};
