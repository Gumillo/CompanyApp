const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../server.js');
const Employee = require('../../../models/employee.model');
const Department = require('../../../models/department.model');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

chai.use(chaiHttp);
const expect = chai.expect;

describe('GET /api/employees', () => {
  let mongoServer;
  let depId;

  before(async function() {
    this.timeout(10000);
    try {
      mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();

      if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
      }
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

  beforeEach(async () => {
    const dep = new Department({ name: 'IT Department' });
    await dep.save();
    depId = dep._id;

    const testEmpOne = new Employee({ _id: '5d9f1140f10a81216cfd4408', firstName: 'John', lastName: 'Doe', department: depId });
    await testEmpOne.save();

    const testEmpTwo = new Employee({ _id: '5d9f1159f81ce8d1ef2bee48', firstName: 'Amanda', lastName: 'Doe', department: depId });
    await testEmpTwo.save();
  });

  afterEach(async () => {
    await Employee.deleteMany();
    await Department.deleteMany();
  });

  it('/ should return all employees', async () => {
    const res = await chai.request(server).get('/api/employees');
    expect(res.status).to.be.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body.length).to.be.equal(2);
  });

  it('/:id should return one employee by :id ', async () => {
    const res = await chai.request(server).get('/api/employees/5d9f1140f10a81216cfd4408');
    expect(res.status).to.be.equal(200);
    expect(res.body).to.be.an('object');
    expect(res.body.firstName).to.be.equal('John');
  });

  it('/random should return one random employee', async () => {
    const res = await chai.request(server).get('/api/employees/random');
    expect(res.status).to.be.equal(200);
    expect(res.body).to.be.an('object');
    expect(res.body.firstName).to.not.be.null;
  });
});

describe('POST /api/employees', () => {
  let mongoServer;
  let depId;

  before(async function() {
    this.timeout(10000);
    try {
      mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();

      if (mongoose.connection.readyState !== 0) {
          await mongoose.disconnect();
      }
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
  
  beforeEach(async () => {
    const dep = new Department({ name: 'IT Department' });
    await dep.save();
    depId = dep._id;
  });

  afterEach(async () => {
    await Employee.deleteMany();
    await Department.deleteMany();
  });

  it('/ should insert new document to db and return success', async () => {
    const res = await chai.request(server).post('/api/employees').send({ firstName: '#John', lastName: '#Doe', department: depId });
    expect(res.status).to.be.equal(200);
    expect(res.body.message).to.be.equal('OK');

    const newEmployee = await Employee.findOne({ firstName: '#John' });
    expect(newEmployee).to.not.be.null;
  });
});

describe('PUT /api/employees', () => {
  let mongoServer;
  let depId;

  before(async function() {
    this.timeout(10000);
    try {
      mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();

      if (mongoose.connection.readyState !== 0) {
          await mongoose.disconnect();
      }
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

  beforeEach(async () => {
    const dep = new Department({ name: 'IT Department' });
    await dep.save();
    depId = dep._id;

    const testEmpOne = new Employee({ _id: '5d9f1140f10a81216cfd4408', firstName: 'John', lastName: 'Doe', department: depId });
    await testEmpOne.save();
  });

  afterEach(async () => {
    await Employee.deleteMany();
    await Department.deleteMany();
  });

  it('/:id should update chosen document and return success', async () => {
    const res = await chai.request(server).put('/api/employees/5d9f1140f10a81216cfd4408').send({ firstName: '=#John=' });
    expect(res.status).to.be.equal(200);
    expect(res.body.message).to.be.equal('OK');

    const updatedEmployee = await Employee.findOne({ _id: '5d9f1140f10a81216cfd4408' });
    expect(updatedEmployee).to.not.be.null;
    expect(updatedEmployee.firstName).to.be.equal('=#John=');
  });
});

describe('DELETE /api/employees', () => {
  let mongoServer;
  let depId;

  before(async function() {
    this.timeout(10000);
    try {
      mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();

      if (mongoose.connection.readyState !== 0) {
          await mongoose.disconnect();
      }
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

  beforeEach(async () => {
    const dep = new Department({ name: 'IT Department' });
    await dep.save();
    depId = dep._id;

    const testEmpOne = new Employee({ _id: '5d9f1140f10a81216cfd4408', firstName: 'John', lastName: 'Doe', department: depId });
    await testEmpOne.save();
  });

  afterEach(async () => {
    await Employee.deleteMany();
    await Department.deleteMany();
  });

  it('/:id should delete chosen document and return success', async () => {
    const res = await chai.request(server).delete('/api/employees/5d9f1140f10a81216cfd4408');
    expect(res.status).to.be.equal(200);
    expect(res.body.message).to.be.equal('OK');

    const deletedEmployee = await Employee.findOne({ _id: '5d9f1140f10a81216cfd4408' });
    expect(deletedEmployee).to.be.null;
  });
});
