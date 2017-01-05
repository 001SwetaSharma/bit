const fs = require('fs');
const path = require('path');
const loadCompiler = require('../compilers/load-compiler');
const requireFromString = require('require-from-string');
const { NO_PLUGIN_TYPE } = require('../constants');
const BitJson = require('../bit-json');

class Bit {
  constructor(bitPath, consumer) {
    this.bitJson = null;
    this.bitPath = bitPath;
    this.consumer = consumer;
  }

  getPath() {
    return this.bitPath;
  }

  getBitJson() {
    if (!this.bitJson) { return this.populateAndGetBitJson(); }

    return this.bitJson;
  }

  populateAndGetBitJson() {
    this.bitJson = BitJson.load(this.bitPath);
    return this.bitJson;
  }

  getImpl() {
    const implBasename = this.getBitJson().getImpl() || this.consumer.getBitJson().getImpl();
    const implFilePath = path.join(this.getPath(), implBasename);
    const compilerName = this.getBitJson().getCompiler() ||
    this.consumer.getBitJson().getCompiler() || NO_PLUGIN_TYPE;

    if (compilerName === NO_PLUGIN_TYPE) return require(implFilePath); // eslint-disable-line

    const compiler = loadCompiler(compilerName, this.consumer);
    const rawImpl = fs.readFileSync(implFilePath, 'utf8');
    return requireFromString(compiler.compile(rawImpl).code, implFilePath);
  }
}

module.exports = Bit;
