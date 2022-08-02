// Initializes the `user-room` service on path `/user-room`
const { UserRoom } = require('./user-room.class');
const createModel = require('../../models/user-room.model');
const hooks = require('./user-room.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/user-room', new UserRoom(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('user-room');

  service.hooks(hooks);
};
