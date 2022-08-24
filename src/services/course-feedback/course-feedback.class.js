const { Service } = require("feathers-mongoose");
const { default: mongoose } = require("mongoose");

exports.CourseFeedback = class CourseFeedback extends Service {
  async find(params) {
    const { type, course_id } = params.query;
    let rawCourseId = mongoose.Types.ObjectId(course_id);
    switch (type) {
      case "rating":
        const result = await this.Model.aggregate([
          { $match: { course_id: rawCourseId } },
          {
            $group: { _id: "$rating", total: { $sum: 1 } },
          },
          { $sort: { _id: 1 } },
        ]);
        return [...Array(5)]
          .map((_, index) => ({ _id: index + 1, total: 0 }))
          .map((item, index) => result[index] || item);
      case "comment":
        const originalResult = await super.find(params);
        const reply = await Promise.all(
          originalResult.data.map((item) =>
            this.Model.find({ reply_to: item._id }).exec()
          )
        );
        return {
          ...originalResult,
          data: originalResult.data.map((item, index) => {
            return {
              ...item,
              reply_count: reply[index].length,
            };
          }),
        };

      default:
        return super.find(params);
    }
  }
};
