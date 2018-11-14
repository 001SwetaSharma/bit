// @flow
import { BitObject } from '../objects';
import { bufferFrom, getStringifyArgs } from '../../utils';
import logger from '../../logger/logger';

export type ExtensionField = {
  name: string,
  type: string,
  value: any
};

export default class ExtensionDataModel extends BitObject {
  data: ExtensionField[];

  constructor(data: ExtensionField[]) {
    super();
    this.data = data;
  }

  id() {
    this.sort();
    return this.toString();
  }

  toString() {
    return JSON.stringify(this.data);
  }

  toBuffer(pretty: boolean): Buffer {
    this.sort();
    const args = getStringifyArgs(pretty);
    const str = JSON.stringify(this.data, ...args);
    if (this.validateBeforePersist) this.validateBeforePersisting(str);
    return bufferFrom(str);
  }

  static parse(content: string): ExtensionDataModel {
    return new ExtensionDataModel(JSON.parse(content));
  }

  static from(data: Object[]): ExtensionDataModel {
    return new ExtensionDataModel(data);
  }

  sort() {
    this.data.sort((a, b) => a.name.localeCompare(b.name));
  }

  validateBeforePersisting(content: string): void {
    logger.debug('validating extension object: ', this.hash().hash);
    const extension = ExtensionDataModel.parse(content);
    extension.validate();
  }

  validate() {
    this.data.forEach((field) => {
      if (!field.name) throw new Error('extension.validate, name property is missing');
      if (!field.type) throw new Error('extension.validate, type property is missing');
      if (!field.value) throw new Error('extension.validate, value property is missing');
    });
  }
}
