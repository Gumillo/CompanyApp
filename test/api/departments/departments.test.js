const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../server.js');
const Department = require('../../../models/department.model');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

chai.use(chaiHttp);
const expect = chai.expect;

describe('GET /api/departments', () => {
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

  beforeEach(async () => {
    const testDepOne = new Department({ _id: '5d9f1140f10a81216cfd4408', name: 'Department #1' });
    await testDepOne.save();

    const testDepTwo = new Department({ _id: '5d9f1159f81ce8d1ef2bee48', name: 'Department #2' });
    await testDepTwo.save();
  });

  afterEach(async () => {
    await Department.deleteMany();
  });

  it('/ should return all departments', async () => {
    const res = await chai.request(server).get('/api/departments');
    expect(res.status).to.be.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body.length).to.be.equal(2);
  });

  it('/:id should return one department by :id ', async () => {
    const res = await chai.request(server).get('/api/departments/5d9f1140f10a81216cfd4408');
    expect(res.status).to.be.equal(200);
    expect(res.body).to.be.an('object');
    expect(res.body.name).to.be.equal('Department #1');
  });

  it('/random should return one random department', async () => {
    const res = await chai.request(server).get('/api/departments/random');
    expect(res.status).to.be.equal(200);
    expect(res.body).to.be.an('object');
    expect(res.body.name).to.not.be.null;
  });
});

describe('POST /api/departments', () => {
  let mongoServer;

  before(async function() {
    this.timeout(10000);
    try {
      mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();

      // Ensure mongoose is disconnected from previous describe block before reconnecting (although it shouldn't be needed if run sequentially)
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

  afterEach(async () => {
    await Department.deleteMany();
  });

  it('/ should insert new document to db and return success', async () => {
    const res = await chai.request(server).post('/api/departments').send({ name: '#Department #1' });
    expect(res.status).to.be.equal(200);
    expect(res.body.message).to.be.equal('OK');

    const newDepartment = await Department.findOne({ name: '#Department #1' });
    expect(newDepartment).to.not.be.null;
  });
});

describe('PUT /api/departments', () => {
  let mongoServer;

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
    const testDepOne = new Department({ _id: '5d9f1140f10a81216cfd4408', name: 'Department #1' });
    await testDepOne.save();
  });

  afterEach(async () => {
    await Department.deleteMany();
  });

  it('/:id should update chosen document and return success', async () => {
    const res = await chai.request(server).put('/api/departments/5d9f1140f10a81216cfd4408').send({ name: '=#Department #1=' });
    expect(res.status).to.be.equal(200);
    expect(res.body.message).to.be.equal('OK');

    const updatedDepartment = await Department.findOne({ _id: '5d9f1140f10a81216cfd4408' });
    expect(updatedDepartment).to.not.be.null;
    expect(updatedDepartment.name).to.be.equal('=#Department #1=');
  });
});

describe('DELETE /api/departments', () => {
  let mongoServer;

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
    const testDepOne = new Department({ _id: '5d9f1140f10a81216cfd4408', name: 'Department #1' });
    await testDepOne.save();
  });

  afterEach(async () => {
    await Department.deleteMany();
  });

  it('/:id should delete chosen document and return success', async () => {
    const res = await chai.request(server).delete('/api/departments/5d9f1140f10a81216cfd4408');
    expect(res.status).to.be.equal(200);
    expect(res.body.message).to.be.equal('OK');

    const deletedDepartment = await Department.findOne({ _id: '5d9f1140f10a81216cfd4408' });
    expect(deletedDepartment).to.be.null;
  });
});
