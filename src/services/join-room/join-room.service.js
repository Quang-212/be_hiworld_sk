// Initializes the `join-room` service on path `/join-room`
const { JoinRoom } = require('./join-room.class');
const hooks = require('./join-room.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/join-room', new JoinRoom(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('join-room');

  service.hooks(hooks);
};
