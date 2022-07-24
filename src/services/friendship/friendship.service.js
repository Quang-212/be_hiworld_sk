// Initializes the `friendship` service on path `/friendship`
const { Friendship } = require("./friendship.class");
const createModel = require("../../models/friendship.model");
const hooks = require("./friendship.hooks");

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get("paginate"),
  };

  // Initialize our service with any options it requires
  app.use("/friendship", new Friendship(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service("friendship");

  service.hooks(hooks);
};
