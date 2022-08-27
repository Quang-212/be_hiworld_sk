// Initializes the `score-history` service on path `/score-history`
const { ScoreHistory } = require('./score-history.class');
const createModel = require('../../models/score-history.model');
const hooks = require('./score-history.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/score-history', new ScoreHistory(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('score-history');

  service.hooks(hooks);
};
