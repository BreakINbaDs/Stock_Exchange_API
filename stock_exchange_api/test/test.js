'use strict';

const chai = require('chai');
const expect = require('chai').expect;

chai.use(require('chai-http'));

const app = require('../server.js'); // Our app

describe('API endpoint /stock', function() {
  this.timeout(5000); // How long to wait for a response (ms)

  before(function() {

  });

  after(function() {

  });

  // GET - Base Targeting testing
  it('should return "No Companies Passed from Targeting"', function() {
    return chai.request(app)
      .get('/FR&IT&5')
      .then(function(res) {
        expect(res).to.have.status(404);
        expect(res.text).to.be.equal("No Companies Passed from Targeting");
      });
  });

  // GET - Budget Check testing (Remember menualy set budget to 0 in Stock DB)
  it('should return "No Companies Passed from Budget"', function() {
    return chai.request(app)
      .get('/RU&IT&30')
      .then(function(res) {
        expect(res).to.have.status(404);
        expect(res.text).to.be.equal("No Companies Passed from Budget");
      });
  });

  // POST - BaseBid Check testing
  it('should return "No Companies Passed from BaseBid check"', function() {
    return chai.request(app)
      .get('/IN&Finance&29')
      .then(function(res) {
        expect(res).to.have.status(404);
        expect(res.text).to.be.equal("No Companies Passed from BaseBid check");
      });
  });


  // POST - BaseBid Check and returning Winner testing
  it('should return winner\'s id', function() {
    return chai.request(app)
      .get('/FR&Automobile&10')
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        //expect(res.body).to.be.an('object');
      });
  });

});
