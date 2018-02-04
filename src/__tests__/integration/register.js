// flow
// todo- fix flow - AGAIN
// or remove flow

import chai from 'chai';

import server from '../../app';
import db from '../../db';
import {
  encodeToken,
  decodeToken
} from '../../helpers/jwtHelpers';

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

  // the migrations are failing because of this test, at least one line is messing things up
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
          should.exist(res.body.token);
          done();
        });
    });
  });

  it('should not login an unregistered user', (done) => {
    chai.request(server)
      .post('/auth/login')
      .send({
        username: 'Daewon Song',
        password: 'noskateboarding'
      })
      .end((err, res) => {
        should.exist(err);
        res.status.should.eql(500);
        res.type.should.eql('application/json');
        res.body.status.should.eql('error');
        done();
      });
  });

  // describe('GET /auth/logout', () => {
  //   it('should logout a user', done => {
  //     passportStub.login({
  //       username: 'Rodney Mullen',
  //       password: 'noskateboarding',
  //     });
  //     chai
  //       .request(server)
  //       .get('/auth/logout')
  //       .end((err, res) => {
  //         should.not.exist(err);
  //         res.redirects.length.should.eql(0);
  //         res.status.should.eql(200);
  //         res.type.should.eql('application/json');
  //         res.body.status.should.eql('success');
  //         done();
  //       });
  //   });
  // });

  // it('should throw an error if a user is not logged in', done => {
  //   chai
  //     .request(server)
  //     .get('/auth/logout')
  //     .end((err, res) => {
  //       should.exist(err);
  //       res.redirects.length.should.eql(0);
  //       res.status.should.eql(401);
  //       res.type.should.eql('application/json');
  //       res.body.status.should.eql('Please log in');
  //       done();
  //     });
  // });

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

describe('GET /auth/user', () => {
  it('should return a success', (done) => {
    chai.request(server)
      .post('/auth/login')
      .send({
        username: 'Rodney Mullen',
        password: 'noskateboarding'
      })
      .end((error, response) => {
        should.not.exist(error);
        chai.request(server)
          .get('/auth/user')
          .set('authorization', 'Bearer ' + response.body.token)
          .end((err, res) => {
            should.not.exist(err);
            res.status.should.eql(200);
            res.type.should.eql('application/json');
            res.body.status.should.eql('success');
            done();
          });
      });
  });

  it('should throw an error if a user is not logged in', (done) => {
    chai.request(server)
      .get('/auth/user')
      .end((err, res) => {
        should.exist(err);
        res.status.should.eql(400);
        res.type.should.eql('application/json');
        res.body.status.should.eql('Please log in');
        done();
      });
  });
});
