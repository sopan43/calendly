const expect = require('chai').expect;
const jwt = require('jsonwebtoken');
const sinon = require('sinon');

if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'dev';
}

const authMiddleware = require('../middleware/is-auth');

describe('Auth middleware', function() {
  it('should throw an error if no authorization header is present', function() {
    const req = {
      get: function(headerName) {
        return null;
      }
    };
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw(
      'Not authenticated.'
    );
  });

  it('should yield a userId after decoding the token', function() {
    const req = {
      get: function(headerName) {
        return 'Bearer djfkalsdjfaslfjdlas';
      }
    };
    sinon.stub(jwt, 'verify');
    jwt.verify.returns({ userId: 'abc' });
    authMiddleware(req, {}, () => {});
    expect(req).to.have.property('userId');
    expect(req).to.have.property('userId', 'abc');
    expect(jwt.verify.called).to.be.true;
    jwt.verify.restore();
  });

  it('should throw an error if the token cannot be verified', function() {
    const req = {
      get: function(headerName) {
        return 'Bearer xyz';
      }
    };
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
  });
});
