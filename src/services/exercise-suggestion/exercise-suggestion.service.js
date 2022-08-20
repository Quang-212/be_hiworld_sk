// Initializes the `exercise-suggestion` service on path `/exercise-suggestion`
const { ExerciseSuggestion } = require('./exercise-suggestion.class');
const createModel = require('../../models/exercise-suggestion.model');
const hooks = require('./exercise-suggestion.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/exercise-suggestion', new ExerciseSuggestion(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('exercise-suggestion');

  service.hooks(hooks);
};
