// Initializes the `user-info` service on path `/user-info`
const { UserInfo } = require('./user-info.class');
const createModel = require('../../models/user-info.model');
const hooks = require('./user-info.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/user-info', new UserInfo(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('user-info');

  service.hooks(hooks);
};
