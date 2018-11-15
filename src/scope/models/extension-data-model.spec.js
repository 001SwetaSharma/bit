import { expect } from 'chai';
import ExtensionDataModel from './extension-data-model';

const fixtureA = { name: 'A', value: 1, type: 'numeric' };
const fixtureB = { name: 'B', value: 'b', type: 'string' };
const fixtureC = { name: 'C', value: { key: 'myValue' }, type: 'object' };

describe('extension', () => {
  describe('sort', () => {
    let extension;
    before(() => {
      const fields = [fixtureB, fixtureA, fixtureC];
      extension = new ExtensionDataModel(fields);
      extension.sort();
    });
    it('should sort the extension fields by their names', () => {
      const fields = extension.data;
      expect(fields[0]).to.deep.equal(fixtureA);
      expect(fields[1]).to.deep.equal(fixtureB);
      expect(fields[2]).to.deep.equal(fixtureC);
    });
  });
  describe('validate', () => {
    let extension;
    it('should throw an error when the name field is missing', () => {
      extension = new ExtensionDataModel([{ value: 'A', type: 'string' }]);
      const validateFunc = () => extension.validate();
      expect(validateFunc).to.throw();
    });
    it('should throw an error when the value field is missing', () => {
      extension = new ExtensionDataModel([{ name: 'A', type: 'string' }]);
      const validateFunc = () => extension.validate();
      expect(validateFunc).to.throw();
    });
    it('should not throw an error when the value false', () => {
      extension = new ExtensionDataModel([{ name: 'A', type: 'boolean', value: false }]);
      const validateFunc = () => extension.validate();
      expect(validateFunc).to.not.throw();
    });
    it('should throw an error when the type field is missing', () => {
      extension = new ExtensionDataModel([{ name: 'A', value: 'A' }]);
      const validateFunc = () => extension.validate();
      expect(validateFunc).to.throw();
    });
  });
});
