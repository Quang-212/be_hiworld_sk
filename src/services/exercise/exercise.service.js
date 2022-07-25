// Initializes the `exercise` service on path `/exercise`
const { Exercise } = require('./exercise.class');
const createModel = require('../../models/exercise.model');
const hooks = require('./exercise.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/exercise', new Exercise(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('exercise');

  service.hooks(hooks);
};
