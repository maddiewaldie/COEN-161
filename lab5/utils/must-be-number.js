// import the fatal function from log using the "object destructuring" syntax
// it would be the same as doing the following two lines
// const log = require('./log')
// const fatal = log.fatal
const { fatal } = require("./log");

/**
 * @function mustBeNumber
 * @description verifies the given string is a number within the specified range
 */
const mustBeNumber = (label, str, min, max) => {
  const n = parseInt(str);
  if (isNaN(n)) {
    fatal(`No ${label} was provided`);
  } else if (min && n <= min) {
    fatal(
      `${label} is out of bounds. Expected a number greater than ${min} but received ${str}.`
    );
  } else if (max && n >= max) {
    fatal(
      `${label} is out of bounds. Expected a number less than ${max} but received ${str}.`
    );
  }

  return n;
};

module.exports = mustBeNumber;
