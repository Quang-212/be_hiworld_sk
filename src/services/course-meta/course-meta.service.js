// Initializes the `course-meta` service on path `/course-meta`
const { CourseMeta } = require("./course-meta.class");
const createModel = require("../../models/course-meta.model");
const hooks = require("./course-meta.hooks");

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get("paginate"),
    multi: true,
  };

  // Initialize our service with any options it requires
  app.use("/course-meta", new CourseMeta(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service("course-meta");

  service.hooks(hooks);
};
