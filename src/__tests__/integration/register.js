import chai from 'chai';

const should = chai.should();
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

const server = require('../../../src/server');
const db = require('../../../src/db');

describe('routes : auth', () => {
  beforeEach(() => db.migrate.rollback().then(() => db.migrate.latest()));

  afterEach(() => db.migrate.rollback());
});

describe('POST /auth/register', () => {
  it('should register a new user', done => {
    chai
      .request(server)
      .post('/auth/register')
      .send({
        username: 'michael',
        password: 'herman',
      })
      .end((err, res) => {
        should.not.exist(err);
        res.redirects.length.should.eql(0);
        res.status.should.eql(200);
        res.type.should.eql('application/json');
        res.body.status.should.eql('success');
        done();
      });
  });
});
