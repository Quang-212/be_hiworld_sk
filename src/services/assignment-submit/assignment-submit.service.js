// Initializes the `assignment-submit` service on path `/assignment-submit`
const { AssignmentSubmit } = require('./assignment-submit.class');
const createModel = require('../../models/assignment-submit.model');
const hooks = require('./assignment-submit.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/assignment-submit', new AssignmentSubmit(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('assignment-submit');

  service.hooks(hooks);
};
