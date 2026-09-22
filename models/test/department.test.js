const { expect } = require('chai');
const mongoose = require('mongoose');
const Department = require('../department.model.js');

describe('Department', () => {

  it('should throw an error if no "name" arg', () => {
    const dep = new Department({});
    const err = dep.validateSync();
    expect(err).to.exist;
    expect(err.errors.name).to.exist;
  });

  it('should throw an error if "name" is not a string', () => {
    const cases = [{}, []];
    for (let name of cases) {
      const dep = new Department({ name });
      const err = dep.validateSync();
      expect(err).to.exist;
      expect(err.errors.name).to.exist;
    }
  });

  it('should throw an error if "name" is too short or too long', () => {
    const cases = ['Abc', 'abcd', 'Lorem Ipsum, Lorem Ip'];
    for (let name of cases) {
      const dep = new Department({ name });
      const err = dep.validateSync();
      expect(err).to.exist;
      expect(err.errors.name).to.exist;
    }
  });

  it('should not throw an error if "name" is okay', () => {
    const cases = ['Management', 'Human Resources'];
    for (let name of cases) {
      const dep = new Department({ name });
      const err = dep.validateSync();
      expect(err).to.not.exist;
    }
  });

});
