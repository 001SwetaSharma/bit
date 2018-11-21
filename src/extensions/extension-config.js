/** @flow */

import R from 'ramda';
import * as Types from './types';
import ExtensionPropTypes from './extension-prop-types';
import type { DefaultProps, PropsSchema } from './extension-prop-types';

const extensionPropTypes = new ExtensionPropTypes({ types: Types });
const bitConfigPrefix = '__';

export type ExtensionOptions = {
  core?: boolean,
  disabled?: boolean
};

export default class ExtensionConfig {
  // Config as defined in bit.json.
  // might contain:
  // * bit configs - like disabled
  // * extension configs - like reporter or files
  _rawConfig: ?Object;
  // Configs of the extension relevant to bit (like disabled)
  _bitConfig: ?ExtensionOptions;
  rawProps: ?Object;
  props: ?Object;
  // Used to cache the workspace extension store data (used in bit tag command)
  // It's main purpose is to not run over all the extensions and apply the store function for each prop every time
  propsStore: ?Object;

  constructor({
    rawConfig,
    bitConfig,
    rawProps,
    props
  }: {
    rawConfig?: ?Object,
    bitConfig?: ?Object,
    rawProps?: ?Object,
    props?: ?Object
  }) {
    this._rawConfig = rawConfig;
    this._bitConfig = bitConfig;
    this.rawProps = rawProps;
    this.props = props || undefined;
  }

  // get extensionRawConfig() {
  //   const conf = this._extensionRawConfig;
  //   if (conf) {
  //     return conf;
  //   }
  //   if (this._rawConfig) {
  //     this._extensionRawConfig = _getExtensionConfigFromRaw(this._rawConfig);
  //     return this._extensionRawConfig;
  //   }
  //   return {};
  // }

  // get extensionDynamicConfig() {
  //   return this._extensionDynamicConfig || this.extensionRawConfig;
  // }

  // set extensionDynamicConfig(config: Object) {
  //   this._extensionDynamicConfig = config;
  // }

  get bitConfig() {
    const conf = this._bitConfig;
    if (conf) {
      return conf;
    }
    if (this._rawConfig) {
      this._bitConfig = _getBitConfigFromRaw(this._rawConfig);
      return this._bitConfig;
    }
    return {};
  }

  get disabled() {
    return this._bitConfig && this._bitConfig.disabled;
  }

  static fromRawConfig(rawConfig: Object): ExtensionConfig {
    const bitConfig = _getBitConfigFromRaw(rawConfig);
    const rawProps = _getRawPropsFromRawConfig(rawConfig);
    const extensionConfig = new ExtensionConfig({ rawConfig, bitConfig, rawProps });
    return extensionConfig;
  }

  static fromModels(config: Object): ExtensionConfig {
    const props = {};
    config.forEach((configItem) => {
      const typeInstance = extensionPropTypes.getTypeClassByString(configItem.type);
      props[configItem.name] = typeInstance.fromStore(configItem.value);
    });
    return new ExtensionConfig({ props });
  }

  async loadProps(propsSchema: PropsSchema, defaultProps: DefaultProps, context: Object) {
    extensionPropTypes.loadPropsSchema(propsSchema);
    const props = await _getPropsFromRaw(this.rawProps, propsSchema, defaultProps, context);
    this.props = props;
  }

  async storeProps() {
    if (this.propsStore) {
      return this.propsStore;
    }
    this.propsStore = await _getPropsStore(this.props);
    return this.propsStore;
  }

  toBitJsonObject() {
    return {
      ...this.extensionRawConfig,
      ...this.bitConfig
    };
  }
}

const _isKeyStartsWithSignWrapper = sign => (val, key) => key.startsWith(sign);
const _isKeyNotStartsWithSignWrapper = sign => (val, key) => !key.startsWith(sign);

const _getBitConfigFromRaw = (rawConfig: Object): Object => {
  return R.pickBy(_isKeyStartsWithSignWrapper(bitConfigPrefix), rawConfig);
};

const _getRawPropsFromRawConfig = (rawConfig: Object): Object => {
  const rawProps = R.pickBy(_isKeyNotStartsWithSignWrapper(bitConfigPrefix), rawConfig);
  return rawProps;
};

const _getPropsFromRaw = async (
  rawProps: Object,
  propsSchema: PropsSchema,
  defaultProps: DefaultProps,
  context: Object = {}
): Object => {
  const props = await extensionPropTypes.parseRaw(rawProps, propsSchema, defaultProps, context);
  return props;
};

const _getPropsStore = async (props: Object): Object => {
  const propsStore = await extensionPropTypes.toStore(props);
  return propsStore;
};
