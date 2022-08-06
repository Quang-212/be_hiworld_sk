const { Service } = require("feathers-mongoose");
const { default: mongoose } = require("mongoose");

exports.CourseFeedback = class CourseFeedback extends Service {
  async find(params) {
    const { type, courseId } = params.query;
    let rawCourseId = mongoose.Types.ObjectId(courseId);
    switch (type) {
      case "rating":
        const result = await this.Model.aggregate([
          { $match: { courseId: rawCourseId } },
          {
            $group: { _id: "$rating", total: { $sum: 1 } },
          },
          { $sort: { _id: 1 } },
        ]);
        return [
          { _id: 1, total: 0 },
          { _id: 2, total: 0 },
          { _id: 3, total: 0 },
          { _id: 4, total: 0 },
          { _id: 5, total: 0 },
        ].map((item, index) => result[index] || item);
      case "comment":
        const originalResult = await super.find(params);
        const reply = await Promise.all(
          originalResult.data.map((item) =>
            this.Model.find({ replyTo: item._id }).exec()
          )
        );
        return {
          ...originalResult,
          data: originalResult.data.map((item, index) => {
            return {
              ...item,
              replyCount: reply[index].length,
            };
          }),
        };

      default:
        return super.find(params);
    }
  }
};
