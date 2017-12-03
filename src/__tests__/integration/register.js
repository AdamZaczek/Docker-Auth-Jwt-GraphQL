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
