const expect = require('chai').expect;
const bearerToken = require('./');

describe('bearerToken', function () {
  var token = 'test-token';

  it('finds a bearer token in post body under "access_token" and sets it to req.token', function (done) {
    var req = {body:{access_token:token}};
    bearerToken()(req, {}, function () {
      expect(req.token).to.equal(token);
      done();
    });
  });

  it('finds a bearer token in query string under "access_token" and sets it to req.token', function (done) {
    var req = {query:{access_token:token}};
    bearerToken()(req, {}, function () {
      expect(req.token).to.equal(token);
      done();
    });
  });

  it('finds a bearer token in headers under "authorization: Bearer" and sets it to req.token', function (done) {
    var req = {headers:{authorization:'Bearer '+token}};
    bearerToken()(req, {}, function () {
      expect(req.token).to.equal(token);
      done();
    });
  });

  it('finds a bearer token in headers under "authorization: bearer" and sets it to req.token', function (done) {
    var req = {headers:{authorization:'bearer '+token}};
    bearerToken()(req, {}, function () {
      expect(req.token).to.equal(token);
      done();
    });
  });

  it('finds a bearer token in post body under an arbitrary key and sets it to req.token', function (done) {
    var req = {body:{test:token}};
    bearerToken({bodyKey:'test'})(req, {}, function () {
      expect(req.token).to.equal(token);
      done();
    });
  });

  it('finds a bearer token in query string under "access_token" and sets it to req.token', function (done) {
    var req = {query:{test:token}};
    bearerToken({queryKey:'test'})(req, {}, function () {
      expect(req.token).to.equal(token);
      done();
    });
  });

  it('finds a bearer token in headers under "authorization: <anykey>" and sets it to req.token', function (done) {
    var req = {headers:{authorization:'test '+token}};
    bearerToken({headerKey:'test'})(req, {}, function () {
      expect(req.token).to.equal(token);
      done();
    });
  });

  it('finds a bearer token and sets it to req[<anykey>]', function (done) {
    var req = {body:{access_token:token}};
    var reqKey = 'test';
    bearerToken({reqKey:reqKey})(req, {}, function() {
      expect(req[reqKey]).to.equal(token);
      done();
    });
  });

  it('aborts with 400 if token is provided in more than one location', function (done) {
    var req = {
      query: {
        access_token: 'query-token'
      },
      body: {
        access_token: 'query-token'
      },
      headers: {
        authorization: 'bearer header-token'
      },
    };
    var res = {
      send: function (code) {
        expect(code).to.equal(400);
        done();
      }
    }
    bearerToken()(req, res);
  });


});
