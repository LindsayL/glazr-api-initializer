/*jslint node:true, unparam: true*/
/*globals describe, it, before, beforeEach, after, afterEach, vars, path, fse*/

(function () {
  'use strict';

  require('../../support/helper');

  var
    should = require('should'),
    ApiInitializer = require('../../../ApiInitializer.js');

  describe('SPEC.ApiInitializer', function () {
    var
      apiInitializer;
    describe('Instantiation', function () {
      describe('no orgConfig', function () {
        it('should throw an error', function (done) {
          try {
            apiInitializer = new ApiInitializer();
          } catch (e) {
            should.exist(e);
            e.message.should.match(/Must pass an orgConfig/);
            done();
            return;
          }
          should.not.exist('should not get here');
        });
      });
      describe('init with orgConfig', function () {
        it('should succeed', function () {
          apiInitializer = new ApiInitializer({});
          should.exist(apiInitializer);
        });
      });
    });

    describe('Functions', function () {
      beforeEach(function () {
        apiInitializer = new ApiInitializer({});
      });

      describe('#initComponenets(apiName, orgConfig, apiThisObject, requiredComponents)', function () {
        describe('request unsupported component', function () {
          it('should throw an error', function (done) {
            try {
              apiInitializer.initComponents('blah', {}, ['unsupportedComponent']);
            } catch (e) {
              should.exist(e);
              done();
              return;
            }
            should.not.exist('should not get here');
          });
        });
        describe('no required components', function () {
          it('should not modifiy the thisObject', function () {
            var
              originalThis = JSON.stringify({}),
              thisObject = JSON.parse(originalThis);
            apiInitializer.initComponents('blah', thisObject, []);
            JSON.stringify(thisObject).should.equal(originalThis);
          });
        });
        describe('one required components', function () {
          it('should add the required component to the thisObject', function () {
            var
              api = 'blah',
              reqComp = 'reqComp',
              originalThis = JSON.stringify({}),
              thisObject = JSON.parse(originalThis);
            apiInitializer.reqComp = function (apiName) {
              return apiName;
            };
            apiInitializer.initComponents(api, thisObject, [reqComp]);
            // Modifiy originalThis to the expected output
            originalThis = JSON.parse(originalThis);
            originalThis[reqComp] = api;
            JSON.stringify(thisObject).should.equal(JSON.stringify(originalThis));
          });
        });
      });

      describe('#persistor(apiName, orgConfig)', function () {
        //TODO
        //describe('missing orgConfig options', function () {
        //  it('should throw an error', function (done) {
        //    try {
        //      apiInitializer = new ApiInitializer();
        //      apiInitializer.initComponents('blah', {}, ['unsupportedComponent']);
        //    } catch (e) {
        //      should.exist(e);
        //      e.message.should.match(/Must pass an orgConfig/);
        //      done();
        //    }
        //  });
        //});
      });

      describe('#caseIntegrator(apiName, orgConfig)', function () {
        //TODO
      });

    });

  });

}());