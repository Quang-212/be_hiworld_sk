// Initializes the `course-feedback` service on path `/course-feedback`
const { CourseFeedback } = require("./course-feedback.class");
const createModel = require("../../models/course-feedback.model");
const hooks = require("./course-feedback.hooks");

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get("paginate"),
    whitelist: ["$populate", "$search", "$regex"],
  };

  // Initialize our service with any options it requires
  app.use("/course-feedback", new CourseFeedback(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service("course-feedback");

  service.hooks(hooks);
};
