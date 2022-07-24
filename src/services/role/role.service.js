// Initializes the `role` service on path `/role`
const { Role } = require('./role.class');
const createModel = require('../../models/role.model');
const hooks = require('./role.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/role', new Role(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('role');

  service.hooks(hooks);
};
