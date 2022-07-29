const { Service } = require("feathers-mongoose");

exports.CourseList = class CourseList extends Service {
  setup(app) {
    this.app = app;
  }
};
