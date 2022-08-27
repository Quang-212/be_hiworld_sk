const { Service } = require("feathers-mongoose");
exports.Exercise = class Exercise extends Service {
  setup(app) {
    this.app = app;
  }
  async find(params) {
    const { lesson, $limit, $skip } = params.query;
    const exercises = await super.find(params);
    const lessonExercises = await this.app
      .service("lesson-exercise")
      .Model.find({
        lesson,
        exercise: {
          $in: exercises.data.map((exercise) => exercise._id.toString()),
        },
      })
      .limit($limit)
      .skip($skip)
      .populate("lesson")
      .populate("exercise");
    return {
      ...exercises,
      data: lessonExercises,
    };
  }
};
