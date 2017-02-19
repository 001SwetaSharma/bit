const path = require('path');
const { pathHasConsumer } = require('./consumer-utils');
const { NoConsumerFoundException } = require('../exceptions');

const locateConsumer = (absPath) => {
  const buildPropogationPaths = () => {
    const paths = [];
    const pathParts = absPath.split(path.sep);

    pathParts.forEach((val, index) => {
      const part = pathParts.slice(0, index).join('/');
      if (!part) { return; }
      paths.push(part);
    });

    return paths.reverse();
  };


  if (pathHasConsumer(absPath)) return absPath;
  const resultPath = buildPropogationPaths().find(searchPath => pathHasConsumer(searchPath));

  if (resultPath) return resultPath;
  throw new NoConsumerFoundException(absPath);
};

module.exports = locateConsumer;
