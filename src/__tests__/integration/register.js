import chai from 'chai';
import server from '../../app';
import db from '../../db';

const should = chai.should();
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

describe('routes : auth', () => {
  beforeEach(() => db.migrate.rollback().then(() => db.migrate.latest()));

  afterEach(() => db.migrate.rollback());
});

// this test is still failing, apparently I need to larn how to connect to Redis and
// Postgres via docker or locally
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
