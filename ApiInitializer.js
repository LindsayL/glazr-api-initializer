/*jslint node: true*/

(function () {
  'use strict';

  var
    path = require('path'),
    utils = require('glazr-utils'),
    ApiInitializer;

  /**
   *
   * @constructor
   */
  ApiInitializer = function () {
    // Nothing to do here
  };

  /**
   * Initializes all the recognized, requested components of a specified api.
   * Recognized components includes: 'persistor'
   * orgConfig is expected to follow the guide outlined in Glazr's readme.
   *
   * @param {string} apiName - The name of the api to initialize components for.
   * @param {object} orgConfig - The organization config.
   * @param {object} apiThisObject - the 'this' object when in the api's
   * constructor.  Will initialize a param in 'this' for each recognized component.
   * @param {array} requiredComponents - The components that the api requires.
   */
  ApiInitializer.prototype.initComponents = function (apiName, orgConfig, apiThisObject, requiredComponents) {
    var
      self = this;
    utils.forEach(requiredComponents, function (index, componentName) {
      /*jslint unparam:true*/
      if (!self[componentName]) {
        throw new Error('The required component, "' + componentName + '", of api, "'
            + apiName + '", is not currently supported by ApiIinitializer.');
      }
      apiThisObject[componentName] = self[componentName](apiName, orgConfig);
    });

  };

  ApiInitializer.prototype.persistor = function (apiName, orgConfig) {
    var
      config,
      Persistor = require('glazr-persistor');

    config = orgConfig[apiName].persistor || orgConfig.persistor || {type: 'MultiFile'};
    config.config = config.config || {};

    // In the case of these implementations create the default path.
    if (config.type === 'LocalFile') {
      config.config.filePath =
        config.config.filePath ||
        path.join(orgConfig.resourceDir, orgConfig.organization, apiName + '.json');
    } else if (config.type === 'MultiFile') {
      config.config.dir =
        config.config.dir ||
        path.join(orgConfig.resourceDir, orgConfig.organization, apiName);
    }

    return new Persistor(config);
  };

  ApiInitializer.prototype.caseIntegrator = function (apiName, orgConfig) {
    var
      config,
      CaseIntegrator;

    config = orgConfig[apiName].caseIntegrator || orgConfig.caseIntegrator;

    if (!config || !config.type) {
      // Return an empty integrator
      return {
        createCase: function (id, title, description, callback) {
          /*jslint unparam:true*/
          if (callback) {
            callback(null, id);
          }
        }
      };
    }

    CaseIntegrator = require(path.join('./integrator', config.type));

    config.config.caseViewUrl = orgConfig.Triage['triage-view-url'] + orgConfig.organization + 'case';

    return new CaseIntegrator(config.config);
  };


  module.exports = ApiInitializer;
}());