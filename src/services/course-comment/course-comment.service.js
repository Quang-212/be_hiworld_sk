// Initializes the `course-comment` service on path `/course-comment`
const { CourseComment } = require('./course-comment.class');
const createModel = require('../../models/course-comment.model');
const hooks = require('./course-comment.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/course-comment', new CourseComment(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('course-comment');

  service.hooks(hooks);
};
