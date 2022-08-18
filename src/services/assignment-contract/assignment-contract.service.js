// Initializes the `assignment-contract` service on path `/assignment-contract`
const { AssignmentContract } = require("./assignment-contract.class");
const createModel = require("../../models/assignment-contract.model");
const hooks = require("./assignment-contract.hooks");

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get("paginate"),
  };

  // Initialize our service with any options it requires
  app.use("/assignment-contract", new AssignmentContract(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service("assignment-contract");

  service.hooks(hooks);
};
