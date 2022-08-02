// Initializes the `user-ranking` service on path `/user-ranking`
const { UserRanking } = require('./user-ranking.class');
const createModel = require('../../models/user-ranking.model');
const hooks = require('./user-ranking.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/user-ranking', new UserRanking(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('user-ranking');

  service.hooks(hooks);
};
