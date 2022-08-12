// Initializes the `assignment-chat` service on path `/assignment-chat`
const { AssignmentChat } = require('./assignment-chat.class');
const hooks = require('./assignment-chat.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/assignment-chat', new AssignmentChat(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('assignment-chat');

  service.hooks(hooks);
};
