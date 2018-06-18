export default {
  getRandomInteger(min, max) {
    return Math.floor(Math.random() * ((max - min) + 1)) + min;
  },
  getRandomIntegers(min, max, integerCount) {
    const nodeValues = [];
    for (let i = 0; i < integerCount; i += 1) {
      nodeValues.push(this.getRandomInteger(min, max));
    }
    return nodeValues;
  },
};
