// Initializes the `user-course` service on path `/user-course`
const { UserCourse } = require('./user-course.class');
const createModel = require('../../models/user-course.model');
const hooks = require('./user-course.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/user-course', new UserCourse(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('user-course');

  service.hooks(hooks);
};
