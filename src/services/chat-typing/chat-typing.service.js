// Initializes the `chat-typing` service on path `/chat-typing`
const { ChatTyping } = require('./chat-typing.class');
const hooks = require('./chat-typing.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/chat-typing', new ChatTyping(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('chat-typing');

  service.hooks(hooks);
};
