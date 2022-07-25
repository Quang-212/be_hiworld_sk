// Initializes the `lesson-comment` service on path `/lesson-comment`
const { LessonComment } = require('./lesson-comment.class');
const createModel = require('../../models/lesson-comment.model');
const hooks = require('./lesson-comment.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/lesson-comment', new LessonComment(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('lesson-comment');

  service.hooks(hooks);
};
