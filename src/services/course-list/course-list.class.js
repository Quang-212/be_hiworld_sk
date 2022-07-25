const { Service } = require("feathers-mongoose");

exports.CourseList = class CourseList extends Service {
  setup(app) {
    this.app = app;
  }
  async create(data, params) {
    const newCourse = await super.create(data, params);
    await this.app.service("course-meta").create({ courseId: newCourse._id });
    return newCourse;
  }
};
