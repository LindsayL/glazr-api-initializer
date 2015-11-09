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
   * @param {string} apiName - The name of the api to initialize components for.
   * @param {object} apiThisObject - the 'this' object when in the api's
   * constructor.  Will initialize a param in 'this' for each recognized component.
   * @param {array} requiredComponents - The components that the api requires.
   */
  ApiInitializer.prototype.initComponents = function (apiName, apiThisObject, requiredComponents) {
    var
      self = this;
    utils.forEach(requiredComponents, function (index, componentName) {
      /*jslint unparam:true*/
      if (!self[componentName]) {
        throw new Error('The required component, "' + componentName + '", of api, "'
            + apiName + '", is not currently supported by ApiIinitializer.');
      }
      self.orgConfig[apiName] = self.orgConfig[apiName] || {};
      apiThisObject[componentName] = self[componentName](apiName);
    });

  };

  ApiInitializer.prototype.persistor = function (apiName) {
    var
      orgConfig = this.orgConfig,
      config,
      Persistor = require('glazr-persistor');

    config = orgConfig[apiName].persistor || orgConfig.persistor || {type: 'MultiFile'};
    config.config = config.config || {};

    // In the case of these implementations create the default path.
    if (config.type === 'LocalFile' || config.type === 'MultiFile') {
      this.checkFor(['resourceDir']);
      this.checkFor(['organization']);

      if (config.type === 'LocalFile') {
        config.config.filePath =
          config.config.filePath ||
          path.join(orgConfig.resourceDir, orgConfig.organization, apiName + '.json');
      } else if (config.type === 'MultiFile') {
        config.config.dir =
          config.config.dir ||
          path.join(orgConfig.resourceDir, orgConfig.organization, apiName);
      }
    }

    return new Persistor(config);
  };

  ApiInitializer.prototype.caseIntegrator = function (apiName) {
    var
      orgConfig = this.orgConfig,
      config,
      CaseIntegrator;

    config = orgConfig[apiName].caseIntegrator || orgConfig.caseIntegrator;

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
    this.checkFor(['triage-view-url']);
    this.checkFor(['organization']);
    config.config = config.config || {};
    config.config.caseViewUrl = orgConfig['triage-view-url'] + '/' + orgConfig.organization + '/case';

    return new CaseIntegrator(config.config);
  };

  /**
   * Checks for the existence of "params" in orgConfig.
   * @param {array} params - The params to check for. eg. if you want to check
   * for orgConfig.case.persistor pass ['case', persistor']
   */
  ApiInitializer.prototype.checkFor = function (params) {
    var
      outputString = "",
      val = this.orgConfig;
    utils.forEach(params, function (index, param) {
      /*jslint unparam:true*/
      val = val[param];
      outputString += param;
      if (val === undefined || val === null) {
        var
          err = new Error('orgConfig is missing "' + outputString + '" attribute');
        err.code = 500;
        throw err;
      }
      outputString += '.';
    });
  };


  module.exports = ApiInitializer;
}());