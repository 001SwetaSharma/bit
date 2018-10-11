import BaseType from './BaseType';

export default class String extends BaseType {
  constructor(val) {
    super(val);
    this.name = 'string';
  }

  static validate(val): boolean {
    return typeof val === 'string';
  }
}
