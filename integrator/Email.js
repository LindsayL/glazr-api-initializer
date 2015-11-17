/*jslint node:true*/
(function () {
  'use strict';

  /**
   *
   * @param config
   * @param config.baseUrl - the base url for viewing the document (the document id will be appended)
   * @param config.senderAddress - the system address for sending emails
   * @param config.receiverAddress - the email endpoint for the system integration
   * @returns {EmailIntegrator}
   * @constructor
   */
  var EmailIntegrator = function (config) {
      this.type = 'Email';
      this.config = config;
      this.nodemailer = require('nodemailer');
    };

  /**
   * Formats case data for email body
   * @param id
   * @param title - The title
   * @param description - The description
   * @returns {string}
   */
  EmailIntegrator.prototype.formatMessage = function (id, title, description) {
    /*jslint unparam:true*/
    var
      link = this.config.baseUrl + '/' + id;

    return '\n\n Description: ' + (description || '') +
      '\n\n View: ' + link;
  };

  /**
   *
   * @param id - id of the new document
   * @param title - The title
   * @param description - The description
   * @param callback
   */
  EmailIntegrator.prototype.create = function (id, title, description, callback) {
    var
      transporter = this.nodemailer.createTransport(),
      message = this.formatMessage(id, title, description),
      options = {
        from: this.config.senderAddress,
        to: this.config.receiverAddress,
        subject: title || '',
        text: message
      };
    transporter.sendMail(options, callback);
  };

  module.exports = EmailIntegrator;
}());