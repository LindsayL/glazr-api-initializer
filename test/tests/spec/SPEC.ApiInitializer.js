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
      it('should instantiate', function () {
        apiInitializer = new ApiInitializer();
        should.exist(apiInitializer);
      });
    });

    describe('Functions', function () {
      var
        myId = 1,
        myItem = {id: 2, param: 'blah'},
        myCallback = function (err) {};

      beforeEach(function () {
        apiInitializer = new ApiInitializer();
      });

      describe('#initComponenets(apiName, orgConfig, apiThisObject, requiredComponents)', function () {
        describe('request unsupported component', function () {
          it('should throw an error', function (done) {
            try {
              apiInitializer.initComponents('blah', {}, {}, ['unsupportedComponent']);
            } catch (e) {
              should.exist(e);
              done();
            }
          });
        });
        describe('no required components', function () {
          it('should not modifiy the thisObject', function () {
            var
              originalThis = JSON.stringify({}),
              thisObject = JSON.parse(originalThis);
            apiInitializer.initComponents('blah', {}, thisObject, []);
            JSON.stringify(thisObject).should.equal(originalThis);
          });
        });
        describe('one required components', function () {
          it('should add the required component to the thisObject', function () {
            var
              reqComp = 'reqComp',
              originalThis = JSON.stringify({}),
              thisObject = JSON.parse(originalThis);
            apiInitializer.reqComp = function (apiName) {
              return apiName;
            };
            apiInitializer.initComponents('blah', {}, thisObject, [reqComp]);
            // Modifiy originalThis to the expected output
            originalThis = JSON.parse(originalThis);
            originalThis[reqComp] = reqComp;
            JSON.stringify(thisObject).should.equal(JSON.stringify(originalThis));
          });
        });
      });

      describe('#get(id, callback)', function () {
        it('should call the adapters get method with the same args', function (done) {
          sinon.stub(persistor.adapter, 'get', function (id, callback) {
            id.should.equal(myId);
            String(callback).should.equal(String(myCallback));
            done();
          });
          persistor.get(myId, myCallback);
        });
      });

      describe('#getAll(callback)', function () {
        it('should call the adapters getAll method with the same args', function (done) {
          sinon.stub(persistor.adapter, 'getAll', function (callback) {
            String(callback).should.equal(String(myCallback));
            done();
          });
          persistor.getAll(myCallback);
        });
      });

      describe('#update(record, callback)', function () {
        it('should throw an error if no id in reocrd', function (done) {
          persistor.update({param: 'blah'}, function (err) {
            should.exist(err);
            err.code.should.equal(NO_ID_CODE);
            done();
          });
        });
        it('should call the adapters update method with the same args', function (done) {
          sinon.stub(persistor.adapter, 'update', function (record, callback) {
            JSON.stringify(record).should.equal(JSON.stringify(myItem));
            String(callback).should.equal(String(myCallback));
            done();
          });
          persistor.update(myItem, myCallback);
        });
      });

      describe('#remove(callback)', function () {
        it('should call the adapters remove method with the same args', function (done) {
          sinon.stub(persistor.adapter, 'remove', function (id, callback) {
            id.should.equal(myId);
            String(callback).should.equal(String(myCallback));
            done();
          });
          persistor.remove(myId, myCallback);
        });
      });

    });

  });

}());