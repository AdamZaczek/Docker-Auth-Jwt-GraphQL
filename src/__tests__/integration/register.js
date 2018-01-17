// flow
// todo- fix flow - AGAIN

import chai from 'chai';
import passportStub from 'passport-stub';

import server from '../../app';
import db from '../../db';
import { encodeToken, decodeToken } from '../../helpers/jwtHelpers';

const should = chai.should();
const chaiHttp = require('chai-http');

chai.use(chaiHttp);
passportStub.install(server);

describe('routes : auth', () => {
  beforeEach(() =>
    db.migrate
      .rollback()
      .then(() => db.migrate.latest())
      .then(() => db.seed.run()),
  );

  // this is causing knex_migration_lock table error because
  // there are no sessions anymore so no logout function
  // afterEach(() => {
  //   passportStub.logout();
  //   return db.migrate.rollback();
  // });

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

  describe('GET /auth/logout', () => {
    it('should logout a user', done => {
      passportStub.login({
        username: 'Rodney Mullen',
        password: 'noskateboarding',
      });
      chai
        .request(server)
        .get('/auth/logout')
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

  it('should throw an error if a user is not logged in', done => {
    chai
      .request(server)
      .get('/auth/logout')
      .end((err, res) => {
        should.exist(err);
        res.redirects.length.should.eql(0);
        res.status.should.eql(401);
        res.type.should.eql('application/json');
        res.body.status.should.eql('Please log in');
        done();
      });
  });

  describe('encodeToken()', () => {
    it('should return a token', done => {
      const results = encodeToken({
        id: 1,
      });
      should.exist(results);
      results.should.be.a('string');
      done();
    });
  });

  describe('decodeToken()', () => {
    it('should return a payload', done => {
      const token = encodeToken({
        id: 1,
      });
      should.exist(token);
      token.should.be.a('string');
      decodeToken(token, (err, res) => {
        should.not.exist(err);
        res.id.should.eql(1);
        done();
      });
    });
  });
});
