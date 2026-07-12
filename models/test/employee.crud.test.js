const Employee = require('../employee.model');
const Department = require('../department.model');
const expect = require('chai').expect;
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

describe('Employee CRUD', () => {
  let mongoServer;

  before(async function() {
    this.timeout(10000);
    try {
      mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();

      await mongoose.connect(mongoUri);
    } catch(err) {
      console.log(err);
    }
  });

  after(async () => {
    await mongoose.disconnect();
    if (mongoServer) {
      await mongoServer.stop();
    }
  });

  describe('Reading data', () => {
    let depId;

    before(async () => {
      const dep = new Department({ name: 'IT Department' });
      await dep.save();
      depId = dep._id;

      const testEmpOne = new Employee({ firstName: 'John', lastName: 'Doe', department: depId });
      await testEmpOne.save();

      const testEmpTwo = new Employee({ firstName: 'Amanda', lastName: 'Doe', department: depId });
      await testEmpTwo.save();
    });

    after(async () => {
      await Employee.deleteMany();
      await Department.deleteMany();
    });

    it('should return all the data with "find" method', async () => {
      const employees = await Employee.find();
      const expectedLength = 2;
      expect(employees.length).to.be.equal(expectedLength);
    });

    it('should return proper document by various params with "findOne" method', async () => {
      const employee = await Employee.findOne({ firstName: 'John' });
      expect(employee.firstName).to.be.equal('John');
    });

  });

  describe('Creating data', () => {

    after(async () => {
      await Employee.deleteMany();
    });

    it('should insert new document with "insertOne" method', async () => {
      const employee = new Employee({ firstName: 'John', lastName: 'Doe', department: new mongoose.Types.ObjectId() });
      await employee.save();
      const savedEmployee = await Employee.findOne({ firstName: 'John' });
      expect(savedEmployee).to.not.be.null;
    });

  });

  describe('Updating data', () => {
    let depId;

    beforeEach(async () => {
      const dep = new Department({ name: 'IT Department' });
      await dep.save();
      depId = dep._id;

      const testEmpOne = new Employee({ firstName: 'John', lastName: 'Doe', department: depId });
      await testEmpOne.save();
    
      const testEmpTwo = new Employee({ firstName: 'Amanda', lastName: 'Doe', department: depId });
      await testEmpTwo.save();
    });
    
    afterEach(async () => {
      await Employee.deleteMany();
      await Department.deleteMany();
    });

    it('should properly update one document with "updateOne" method', async () => {
      await Employee.updateOne({ firstName: 'John' }, { $set: { firstName: '=John=' }});
      const updatedEmployee = await Employee.findOne({ firstName: '=John=' });
      expect(updatedEmployee).to.not.be.null;
    });

    it('should properly update one document with "save" method', async () => {
      const employee = await Employee.findOne({ firstName: 'John' });
      employee.firstName = '=John=';
      await employee.save();
    
      const updatedEmployee = await Employee.findOne({ firstName: '=John=' });
      expect(updatedEmployee).to.not.be.null;
    });

    it('should properly update multiple documents with "updateMany" method', async () => {
      await Employee.updateMany({}, { $set: { firstName: 'Updated!' }});
      const employees = await Employee.find({ firstName: 'Updated!' });
      expect(employees.length).to.be.equal(2);
    });

  });

  describe('Removing data', () => {
    let depId;

    beforeEach(async () => {
      const dep = new Department({ name: 'IT Department' });
      await dep.save();
      depId = dep._id;

      const testEmpOne = new Employee({ firstName: 'John', lastName: 'Doe', department: depId });
      await testEmpOne.save();
    
      const testEmpTwo = new Employee({ firstName: 'Amanda', lastName: 'Doe', department: depId });
      await testEmpTwo.save();
    });
    
    afterEach(async () => {
      await Employee.deleteMany();
      await Department.deleteMany();
    });

    it('should properly remove one document with "deleteOne" method', async () => {
      await Employee.deleteOne({ firstName: 'John' });
      const removedEmployee = await Employee.findOne({ firstName: 'John' });
      expect(removedEmployee).to.be.null;
    });

    it('should properly remove multiple documents with "deleteMany" method', async () => {
      await Employee.deleteMany();
      const employees = await Employee.find();
      expect(employees.length).to.be.equal(0);
    });

  });

});
