// Initializes the `user-follow` service on path `/user-follow`
const { UserFollow } = require('./user-follow.class');
const createModel = require('../../models/user-follow.model');
const hooks = require('./user-follow.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/user-follow', new UserFollow(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('user-follow');

  service.hooks(hooks);
};
