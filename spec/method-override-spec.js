require('./helper');
var methodOverride = mach.methodOverride;
var requestParams = mach.requestParams;

describe('methodOverride', function () {
  var app = methodOverride(function (request) {
    return request.method;
  });

  describe('when the request method is given in a request parameter', function () {
    describe('and the requestParams middleware is in front', function () {
      var innerApp = requestParams(app);

      beforeEach(function () {
        return callApp(innerApp, {
          params: { '_method': 'PUT' }
        });
      });

      it('sets the request method', function () {
        assert.equal(lastResponse.buffer, 'PUT');
      });
    });

    describe('but the requestParams middleware is not in front', function () {
      var error;
      beforeEach(function () {
        error = {};
        return callApp(app, {
          params: { '_method': 'PUT' },
          error: fakeStream(error)
        });
      });

      it('does not set the request method', function () {
        assert.equal(lastResponse.buffer, 'GET');
      });

      it('writes to the error stream', function () {
        assert.equal(error.data, 'No request params. Use mach.requestParams in front of mach.methodOverride\n');
      });
    });
  });

  describe('when the request method is given in a request parameter with multiple values', function () {
    describe('and the requestParams middleware is in front', function () {
      var innerApp = requestParams(app);

      beforeEach(function () {
        return callApp(innerApp, {
          params: { '_method': [ 'PUT', 'DELETE' ] }
        });
      });

      it('sets the request method to the last given value', function () {
        assert.equal(lastResponse.buffer, 'DELETE');
      });
    });
  });

  describe('when the request method is given in an HTTP header', function () {
    beforeEach(function () {
      return callApp(app, {
        headers: { 'X-Http-Method-Override': 'PUT' }
      });
    });

    it('sets the request method', function () {
      assert.equal(lastResponse.buffer, 'PUT');
    });
  });
});
