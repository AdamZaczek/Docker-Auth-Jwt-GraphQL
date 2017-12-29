import chai from 'chai';
import server from '../../app';
import db from '../../db';

const should = chai.should();
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

describe('routes : auth', () => {
  beforeEach(() =>
    db.migrate
      .rollback()
      .then(() => db.migrate.latest())
      .then(() => db.seed.run()),
  );

  afterEach(() => db.migrate.rollback());

  describe('POST /auth/register', () => {
    it('should register a new user', done => {
      chai
        .request(server)
        .post('/auth/register')
        .send({
          username: 'Leonardo',
          password: 'Da Vinci',
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

  describe('POST /auth/login', () => {
    it('should login a user', done => {
      chai
        .request(server)
        .post('/auth/login')
        .send({
          username: 'Rodney Mullen',
          password: 'noskateboarding',
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

  it('should not login an unregistered user', done => {
    chai
      .request(server)
      .post('/auth/login')
      .send({
        username: 'Daewon Song',
        password: 'noskateboarding',
      })
      .end((err, res) => {
        should.exist(err);
        res.redirects.length.should.eql(0);
        res.status.should.eql(404);
        res.type.should.eql('application/json');
        res.body.status.should.eql('User not found');
        done();
      });
  });
});
