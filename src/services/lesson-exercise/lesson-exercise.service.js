// Initializes the `lesson-exercise` service on path `/lesson-exercise`
const { LessonExercise } = require('./lesson-exercise.class');
const createModel = require('../../models/lesson-exercise.model');
const hooks = require('./lesson-exercise.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/lesson-exercise', new LessonExercise(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('lesson-exercise');

  service.hooks(hooks);
};
