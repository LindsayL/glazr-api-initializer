/*jslint node:true*/
/*globals describe, it, before, beforeEach, after, afterEach, vars, path, fse*/

(function () {
  'use strict';

  require('../../support/helper');

  var
    should = require('should'),
    ApiInitializer = require('../../../ApiInitializer.js');

  describe('INTEGRATION', function () {
    var
      config,
      appName = 'blehApp',
      apiName = 'blahApi',
      thisObject,
      apiInitializer;

    beforeEach(function () {
      thisObject = {};
      apiInitializer = undefined;
    });
    describe('#initComponenets(apiName, apiThisObject, requiredComponents)', function () {

      describe('request persistor component', function () {
        beforeEach(function () {
          config = {
            resourceDir: 'somewhere',
            organization: 'blahLtd'
          };
        });
        describe('with minimal orgConfig', function () {
          it('should initialize the default persistor', function () {
            apiInitializer = new ApiInitializer(config);
            apiInitializer.initComponents(appName, apiName, thisObject, ['persistor']);
            should.exist(thisObject.persistor);
            //Check that it is MultiFile
            thisObject.persistor.adapter.type.should.equal('MultiFile');
          });
        });
        describe('with default orgConfig', function () {
          it('should initialize the orgConfigs default persistor', function () {
            config.persistor = {
              type: 'LocalFile'
            };
            apiInitializer = new ApiInitializer(config);
            apiInitializer.initComponents(appName, apiName, thisObject, ['persistor']);
            should.exist(thisObject.persistor);
            thisObject.persistor.adapter.type.should.equal('LocalFile');
          });
        });
        describe('with api specific config', function () {
          it('should initialize the api specific persistor', function () {
            config[appName] = {};
            config[appName][apiName] = {
              persistor: {
                type: 'LocalFile'
              }
            };
            apiInitializer = new ApiInitializer(config);
            apiInitializer.initComponents(appName, apiName, thisObject, ['persistor']);
            should.exist(thisObject.persistor);
            thisObject.persistor.adapter.type.should.equal('LocalFile');
          });
        });
      });

      describe('request integrator component', function () {
        beforeEach(function () {
          config = {
            organization: 'BlahLtd'
          };
        });
        describe('with minimal orgConfig', function () {
          it('should initialize the default integrator', function () {
            apiInitializer = new ApiInitializer(config);
            apiInitializer.initComponents(appName, apiName, thisObject, ['integrator']);
            should.exist(thisObject.integrator);
            //Check that it is MultiFile
            thisObject.integrator.type.should.equal('Empty');
          });
        });
        describe('with default orgConfig', function () {
          it('should initialize the orgConfigs default integrator', function () {
            config.integrator = {
              type: 'Email',
              config: {
                'captureViewUrl': 'somewhere'
              }
            };
            apiInitializer = new ApiInitializer(config);
            apiInitializer.initComponents(appName, apiName, thisObject, ['integrator']);
            should.exist(thisObject.integrator);
            thisObject.integrator.type.should.equal('Email');
          });
        });
        describe('with api specific config', function () {
          it('should initialize the api specific integrator', function () {
            config[appName] = {};
            config[appName][apiName] = {
              integrator: {
                type: 'Email',
                config: {
                  'captureViewUrl': 'somewhere'
                }
              }
            };
            apiInitializer = new ApiInitializer(config);
            apiInitializer.initComponents(appName, apiName, thisObject, ['integrator']);
            should.exist(thisObject.integrator);
            thisObject.integrator.type.should.equal('Email');
          });
        });
      });

    });

  });

}());