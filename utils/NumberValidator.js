module.exports = {
  isPositiveInteger(integer) {
    let isPosInt = true;
    if (integer) {
      if (!Number.isNaN(integer)) {
        if (parseInt(integer, 10) < 0) isPosInt = false;
        if (!Number.isInteger(parseInt(integer, 10))) isPosInt = false;
      }
    } else {
      isPosInt = false;
    }
    return isPosInt;
  },
};
