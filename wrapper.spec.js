var Wrapper = require('./wrapper');
var expect = require('chai').expect;
var request = require('request');

describe('Wrapper', function() {

  it('creates a new wrapper instance', function() {

    var requestOptions = {
      data: 1
    };

    var protocol = 'http:';

    var payload = {
      data: 2
    };

    var wrapper = new Wrapper(requestOptions, protocol, payload);

    expect(wrapper).to.be.ok;
    expect(wrapper.send).to.be.ok;

    expect(wrapper.requestOptions).to.be.eql(requestOptions);
    expect(wrapper.protocol).to.be.eql(protocol);
    expect(wrapper.payload).to.be.eql(payload);

  });

  it('sends a GET new request', function(done) {

    var requestOptions = {
      port: 443,
      host: 'very.host.io',
      headers: [
        ['content-type', 'very-format'],
        ['x-custom', 'alma']
      ],
      method: 'GET',
      path: '/purchases/1/content'
    };

    var apiRespone = {
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        data: 1
      })
    };

    this.sandbox.stub(request, 'get', function(options, callback) {
      expect(options).to.be.eql({
        uri: {
          hostname: requestOptions.host,
          port: requestOptions.port,
          protocol: 'http:',
          pathname: requestOptions.path
        },
        headers: {
          'content-type': 'very-format',
          'x-custom': 'alma'
        },
        timeout: 15000
      });
      callback(null, apiRespone);
    });

    var protocol = 'http:';

    var wrapper = new Wrapper(requestOptions, protocol);

    wrapper.send().then(function(response) {
      expect(response).to.be.eql(apiRespone);
      done();
    }).catch(done);

  });

  it('sends a GET new request and recieves 400', function(done) {

    var requestOptions = {
      port: 443,
      host: 'very.host.io',
      headers: [
        ['content-type', 'very-format'],
        ['x-custom', 'alma']
      ],
      method: 'GET',
      path: '/purchases/1/content'
    };

    var apiRespone = {
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        replyText: 'Unknown route'
      }),
      statusCode: 400
    };

    this.sandbox.stub(request, 'get', function(options, callback) {
      expect(options).to.be.eql({
        uri: {
          hostname: requestOptions.host,
          port: requestOptions.port,
          protocol: 'http:',
          pathname: requestOptions.path
        },
        headers: {
          'content-type': 'very-format',
          'x-custom': 'alma'
        },
        timeout: 15000
      });
      callback(null, apiRespone);
    });

    var protocol = 'http:';

    var wrapper = new Wrapper(requestOptions, protocol);

    wrapper.send().then(function() {
      throw new Error('Error should have beeen thrown');
    }).catch(function(err) {
      expect(err).to.be.eql({
        message: 'Error in http response',
        name: 'SuiteRequestError',
        code: 400,
        data: {
          replyText: 'Error in http response'
        },
        replyText: 'Unknown route'
      });
      done();
    });

  });


});
