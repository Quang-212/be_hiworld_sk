const { Service } = require("feathers-mongoose");

exports.CourseCategory = class CourseCategory extends Service {
  async patch(id, data, params) {
    if (!data?.parent_id) {
      data.parent_id = null;
    }
    return await super.patch(id, data, params);
  }
};
