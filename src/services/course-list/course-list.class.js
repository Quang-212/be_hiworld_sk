const { Service } = require("feathers-mongoose");
const { default: mongoose } = require("mongoose");

exports.CourseList = class CourseList extends Service {
  setup(app) {
    this.app = app;
  }
  async find(params) {
    try {
      const { find_type, limit } = params.query;
      const result = await super.find(params);

      if (find_type === "full_lesson" && +limit === 1) {
        const lessonCategories = await this.app
          .service("lesson-category")
          .Model.aggregate([
            { $match: { course: result.data[0]._id } },
            {
              $lookup: {
                from: "lessons",
                localField: "_id",
                foreignField: "chapter",
                as: "lessons",
              },
            },
          ]);

        result.data[0].lessons = lessonCategories;
      }

      return result;
    } catch (error) {
      console.log(error);
    }
  }
};
