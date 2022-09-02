// Initializes the `calling` service on path `/calling`
const { Calling } = require('./calling.class');
const hooks = require('./calling.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/calling', new Calling(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('calling');

  service.hooks(hooks);
};
