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
      persConfig,
      Persistor = require('glazr-persistor');

    persConfig = orgConfig[apiName].persistor || orgConfig.persistor;

    // In the case of these implementations create the default path.
    if (persConfig.type === 'LocalFile') {
      persConfig.config.filePath =
        persConfig.config.filePath ||
        path.join(orgConfig.resourceDir, orgConfig.organization, apiName + '.json');
    } else if (persConfig.type === 'MultiFile') {
      persConfig.config.dir =
        persConfig.config.dir ||
        path.join(orgConfig.resourceDir, orgConfig.organization, apiName);
    }

    return new Persistor(persConfig);
  };

  ///**
  // * Retrieves the implementation of the integrator.
  // *
  // * @param {object} integratorConfig - The config for the integrator.
  // * @returns {object} - The instantiated integrator.
  // */
  //ApiInitializer.prototype.integrator = function (apiName, orgConfig) {
  //  var
  //    integratorConfig = orgConfig.integrator,
  //    caseIntegrator;
  //
  //  if (integratorConfig && integratorConfig.type) {
  //    var
  //      defaultConf = {
  //        senderAddress: '',
  //        receiverAddress: '',
  //        caseViewUrl: 'http://triage-view.glazrsoftware.com/cases'
  //      },
  //      conf = {},
  //      CaseIntegrator = require(path.join(__dirname, '../integrators', integratorConfig.type));
  //
  //    // TODO remove should be getting the email from org config
  //    var
  //      apiHelper = require(path.join(__dirname, '../../app/helpers/routerApiHelper')),
  //      settingsApi = apiHelper.initApi('settings', orgConfig);
  //
  //    settingsApi.getSetting('integrationEmail', function (err, email) {
  //      /*jslint unparam:true*/
  //      conf.receiverAddress = email;
  //    });
  //
  //    conf.caseViewUrl = orgConfig.Triage['triage-view-url'] + orgConfig.organization + 'case';
  //    conf = utils.merge(defaultConf, conf);
  //
  //    caseIntegrator = new CaseIntegrator(conf);
  //  } else {
  //    caseIntegrator = {
  //      createCase: function (id, title, description, callback) {
  //        /*jslint unparam:true*/
  //        callback = callback || function () {return undefined; };
  //        callback(null, id);
  //      }
  //    };
  //  }
  //  return caseIntegrator;
  //};


  module.exports = ApiInitializer;
}());