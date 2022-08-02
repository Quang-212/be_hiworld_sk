// Initializes the `assignment-comment` service on path `/assignment-comment`
const { AssignmentComment } = require('./assignment-comment.class');
const createModel = require('../../models/assignment-comment.model');
const hooks = require('./assignment-comment.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/assignment-comment', new AssignmentComment(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('assignment-comment');

  service.hooks(hooks);
};
