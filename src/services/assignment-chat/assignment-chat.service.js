// Initializes the `assignment-chat` service on path `/assignment-chat`
const { AssignmentChat } = require("./assignment-chat.class");
const createModel = require("../../models/assignment-chat.model");
const hooks = require("./assignment-chat.hooks");

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get("paginate"),
    whitelist: ["$populate", "$search", "$regex"],
  };

  // Initialize our service with any options it requires
  app.use("/assignment-chat", new AssignmentChat(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service("assignment-chat");

  service.hooks(hooks);
};
