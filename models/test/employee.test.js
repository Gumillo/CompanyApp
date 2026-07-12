const { expect } = require('chai');
const mongoose = require('mongoose');
const Employee = require('../employee.model.js');

describe('Employee', () => {

  it('should throw an error if any required arg is missing', () => {
    const cases = [
      { firstName: 'John', lastName: 'Doe' }, // missing department
      { firstName: 'John', department: 'IT' }, // missing lastName
      { lastName: 'Doe', department: 'IT' }, // missing firstName
      {} // missing all
    ];

    for (let param of cases) {
      const emp = new Employee(param);

      emp.validateSync(err => {
        expect(err.errors).to.exist;
      });
    }
  });

  it('should throw an error if "firstName" is not a string', () => {
    const cases = [{}, []];
    for (let firstName of cases) {
      const emp = new Employee({ firstName, lastName: 'Doe', department: 'IT' });
  
      emp.validateSync(err => {
        expect(err.errors.firstName).to.exist;
      });
    }
  });

  it('should throw an error if "lastName" is not a string', () => {
    const cases = [{}, []];
    for (let lastName of cases) {
      const emp = new Employee({ firstName: 'John', lastName, department: 'IT' });
  
      emp.validateSync(err => {
        expect(err.errors.lastName).to.exist;
      });
    }
  });

  it('should throw an error if "department" is not a string/ObjectId', () => {
    const cases = [{}, []];
    for (let department of cases) {
      const emp = new Employee({ firstName: 'John', lastName: 'Doe', department });
  
      emp.validateSync(err => {
        expect(err.errors.department).to.exist;
      });
    }
  });

  it('should not throw an error if all args are okay', () => {
    const cases = [
      { firstName: 'John', lastName: 'Doe', department: new mongoose.Types.ObjectId() },
      { firstName: 'Amanda', lastName: 'Doe', department: new mongoose.Types.ObjectId() }
    ];

    for (let param of cases) {
      const emp = new Employee(param);

      emp.validateSync(err => {
        expect(err).to.not.exist;
      });
    }
  });

});
