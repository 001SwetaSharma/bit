import path from 'path';
import fs from 'fs';
import BitJson from '../bit-json';
import { DEFAULT_DIST_DIRNAME, DEFAULT_BUNDLE_FILENAME } from '../constants';

module.exports = (bitPath, opts) => {
  if (!fs.existsSync(bitPath)) throw new Error(`the component in path "${bitPath}" does not exist`);

  const distFile = path.join(bitPath, DEFAULT_DIST_DIRNAME, DEFAULT_BUNDLE_FILENAME);
  if (fs.existsSync(distFile)) {
    try {
      return opts && opts.pathOnly ? distFile : require(distFile); // eslint-disable-line
    } catch (e) { throw (e); }
  }

  try {
    const bitJson = BitJson.load(bitPath);
    const implFile = path.join(bitPath, bitJson.getImpl());
    return opts && opts.pathOnly ? implFile : require(implFile); // eslint-disable-line
  } catch (e) { throw e; }
};
