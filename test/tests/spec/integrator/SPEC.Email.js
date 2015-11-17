/*jslint node:true, unparam: true*/
/*globals describe, it, before, beforeEach, after, afterEach, vars, path, fse*/

(function () {
  'use strict';

  require('../../../support/helper');

  var
    should = require('should'),
    Adapter = require('../../../../integrator/Email');

  describe('SPEC.Email', function () {
    var
      adapter;
    describe('Instantiation', function () {
      it('should instantiate', function () {
        adapter = new Adapter();
        should.exist(adapter);
      });
    });

    describe('Functions', function () {
      var
        myCallback = function (err) {};

      beforeEach(function () {
        adapter = new Adapter({});
      });

      describe('#formatMessage(id, title, description)', function () {
        var
          id = 1,
          url = 'blah',
          desc = 'describing',
          message;
        beforeEach(function () {
          adapter.config.caseViewUrl = url;
          message = adapter.formatMessage(id, 'bleh', desc);
        });
        it('should contain the correct link', function () {
          message.indexOf(url + '/' + id).should.be.greaterThan(-1);
        });
        it('should contain the passed description', function () {
          message.indexOf(desc).should.be.greaterThan(-1);
        });
      });

      describe('#createCase(id, title, description, callback)', function () {
        var
          message = 'blah';
        beforeEach(function () {
          adapter.formatMessage = function () {
            return message;
          };
          adapter.nodemailer.createTransport = function () {
            return {
              sendMail: function (opts, callback) {
                callback(opts.text);
              }
            };
          };
        });
        it('should get the message from the formatMessage method', function (done) {
          adapter.createCase('', '', '', function (msg) {
            msg.should.equal(message);
            done();
          });
        });
      });

    });

  });

}());