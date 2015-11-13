/*jslint node: true*/

(function () {
  'use strict';

  var
    path = require('path'),
    utils = require('glazr-utils'),
    ApiInitializer;


  /**
   *
   * @param {object} orgConfig - The organization config.
   * @constructor
   */
  ApiInitializer = function (orgConfig) {
    if (!orgConfig) {
      var
        err = new Error('Must pass an orgConfig when initializing.');
      err.code = 500;
      throw err;
    }
    this.orgConfig = orgConfig;
  };

  /**
   * Initializes all the recognized, requested components of a specified api.
   * Recognized components includes: 'persistor'
   * orgConfig is expected to follow the guide outlined in Glazr's readme.
   *
   * @param {string} appName - The name of the app that the api belongs to.
   * @param {string} apiName - The name of the api to initialize components for.
   * @param {object} apiThisObject - the 'this' object when in the api's
   * constructor.  Will initialize a param in 'this' for each recognized component.
   * @param {array} requiredComponents - The components that the api requires.
   */
  ApiInitializer.prototype.initComponents = function (appName, apiName, apiThisObject, requiredComponents) {
    var
      self = this;
    utils.forEach(requiredComponents, function (index, componentName) {
      /*jslint unparam:true*/
      if (!self[componentName]) {
        throw new Error('The required component, "' + componentName + '", of api, "'
            + apiName + '", of app, "' + appName + '", is not currently supported by ApiIinitializer.');
      }
      self.orgConfig[appName] = self.orgConfig[appName] || {};
      self.orgConfig[appName][apiName] = self.orgConfig[appName][apiName] || {};
      apiThisObject[componentName] = self[componentName](appName, apiName);
    });

  };

  ApiInitializer.prototype.persistor = function (appName, apiName) {
    var
      orgConfig = this.orgConfig,
      config,
      Persistor = require('glazr-persistor');

    config = orgConfig[appName][apiName].persistor || orgConfig.persistor || {type: 'MultiFile'};
    config.config = config.config || {};

    // In the case of these implementations create the default path.
    if (config.type === 'LocalFile' || config.type === 'MultiFile') {
      this.checkFor(['resourceDir'], this.orgConfig);
      this.checkFor(['organization'], this.orgConfig);

      if (config.type === 'LocalFile') {
        config.config.filePath =
          config.config.filePath ||
          path.join(orgConfig.resourceDir, orgConfig.organization, appName, apiName + '.json');
      } else if (config.type === 'MultiFile') {
        config.config.dir =
          config.config.dir ||
          path.join(orgConfig.resourceDir, orgConfig.organization, appName, apiName);
      }
    }

    return new Persistor(config);
  };

  ApiInitializer.prototype.caseIntegrator = function (appName, apiName) {
    var
      orgConfig = this.orgConfig,
      config,
      CaseIntegrator;

    config = orgConfig[appName][apiName].caseIntegrator || orgConfig.caseIntegrator;

    if (!config || !config.type) {
      // Return an empty integrator
      return {
        type: 'Empty',
        createCase: function (id, title, description, callback) {
          /*jslint unparam:true*/
          if (callback) {
            callback(null, id);
          }
        }
      };
    }

    CaseIntegrator = require(path.join(__dirname, 'integrator', config.type));
    this.checkFor(['config', 'captureViewUrl'], config);
    this.checkFor(['organization'], this.orgConfig);
    config.config = config.config || {};
    config.config.caseViewUrl = orgConfig['captureViewUrl'] + '/' + orgConfig.organization + '/case';

    return new CaseIntegrator(config.config);
  };

  /**
   * Checks for the existence of "params" in orgConfig.
   * @param {array} params - The params to check for. eg. if you want to check
   * for orgConfig.case.persistor pass ['case', persistor']
   * @param {object} object - The object to look for the param in.
   */
  ApiInitializer.prototype.checkFor = function (params, object) {
    var
      outputString = "";
    utils.forEach(params, function (index, param) {
      /*jslint unparam:true*/
      object = object[param];
      outputString += param;
      if (object === undefined || object === null) {
        var
          err = new Error('Missing the "' + outputString + '" attribute.');
        err.code = 500;
        throw err;
      }
      outputString += '.';
    });
  };


  module.exports = ApiInitializer;
}());