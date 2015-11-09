/*jslint node:true*/
(function () {
  'use strict';

  /**
   *
   * @param config
   * @param config.baseUrl - the base url for viewing the case (the case id will be appended)
   * @param config.senderAddress - the system address for sending emails
   * @param config.receiverAddress - the email endpoint for the system integration
   * @returns {EmailIntegrator}
   * @constructor
   */
  var EmailIntegrator = function (config) {

      this.config = config;
      this.nodemailer = require('nodemailer');
    };

  /**
   * Formats case data for email body
   * @param id
   * @param title - The case title
   * @param description - the case description
   * @returns {string}
   */
  EmailIntegrator.prototype.formatMessage = function (id, title, description) {
    /*jslint unparam:true*/
    var
      link = this.config.caseViewUrl + '/' + id;

    return '\n\n Description: ' + (description || 'A new case has been submitted.') +
      '\n\n View case: ' + link;
  };

  /**
   *
   * @param id - id of the new case
   * @param title - The case title
   * @param description - the case description
   * @param callback
   */
  EmailIntegrator.prototype.createCase = function (id, title, description, callback) {
    var
      transporter = this.nodemailer.createTransport(),
      message = this.formatMessage(id, title, description),
      options = {
        from: this.config.senderAddress,
        to: this.config.receiverAddress,
        subject: 'New Case in Glazr Capture: Case ' + id,
        text: message
      };
    transporter.sendMail(options, callback);
  };

  module.exports = EmailIntegrator;
}());