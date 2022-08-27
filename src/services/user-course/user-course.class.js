const { Service } = require("feathers-mongoose");

exports.UserCourse = class UserCourse extends Service {
  setup(app) {
    this.app = app;
  }
  async create(data, params) {
    const { user_id, course_id } = data;
    const userCourse = await this.Model.findOne({ user_id, course_id });
    if (userCourse) {
      return "Bạn đã đăng ký khóa học này rồi";
    }
    return super.create(data, params);
  }
};
