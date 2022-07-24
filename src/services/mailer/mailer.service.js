// Initializes the `mailer` service on path `/mailer`
const { Mailer } = require('./mailer.class');
const hooks = require('./mailer.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/mailer', new Mailer(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('mailer');

  service.hooks(hooks);
};
