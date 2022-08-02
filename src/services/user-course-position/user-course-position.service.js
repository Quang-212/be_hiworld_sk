// Initializes the `user-course-position` service on path `/user-course-position`
const { UserCoursePosition } = require('./user-course-position.class');
const createModel = require('../../models/user-course-position.model');
const hooks = require('./user-course-position.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/user-course-position', new UserCoursePosition(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('user-course-position');

  service.hooks(hooks);
};
