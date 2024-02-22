const log = require("./log");

/**
 * @function parseOptions
 * @description reads arguments from the command line and returns
 *              as an object. Any positional arguments go into an
 *              array under the key positional. Any unknown options
 *              go under the unknown key.
 * @param {Array<{name, synonyms}>}
 * @returns {object}
 *
 * @example
 * const options = parseOptions({port: ['p', 'port']})
 *
 */
const parseOptions = (options) => {
  // create lookup table out of options so the function
  // definition is nicer.
  const optionsMap = {};
  for (const [key, opt] of Object.entries(options)) {
    optionsMap[key] = key;
    for (const o of opt) {
      optionsMap[o] = key;
    }
  }

  // create a shallow copy so we don't destroy the original process.argv
  const arguments = process.argv.slice(2);
  const parsedArguments = {
    positional: [],
    unknown: {},
  };

  while (arguments.length > 0) {
    const argument = arguments.shift();
    if (isFlag(argument)) {
      const flag = argument.replace(/^-*/, "");
      let next = arguments.shift();

      if (!optionsMap[flag]) {
        log.warn(`Encountered unknown option: ${flag}`);
        parsedArguments.unknown[flag] = next;
      } else {
        parsedArguments[optionsMap[flag]] = next;
      }
    } else {
      parsedArguments.positional.push(argument);
    }
  }

  return parsedArguments;
};

const isFlag = (arg) => arg.startsWith("-");

module.exports = parseOptions;
