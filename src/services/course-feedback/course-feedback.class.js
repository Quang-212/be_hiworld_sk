const { Service } = require("feathers-mongoose");
const { default: mongoose } = require("mongoose");

exports.CourseFeedback = class CourseFeedback extends Service {
  async find(params) {
    const { type, courseId } = params.query;
    let rawCourseId = mongoose.Types.ObjectId(courseId);
    switch (type) {
      case "rating":
        return await this.Model.aggregate([
          { $match: { courseId: rawCourseId } },
          {
            $group: { _id: "$rating", total: { $sum: 1 } },
          },
          { $sort: { _id: 1 } },
        ]);
      default:
        return super.find(params);
    }
  }
};
