const { Service } = require("feathers-mongoose");
exports.Exercise = class Exercise extends Service {
  setup(app) {
    this.app = app;
  }
  async find(params) {
    const { lessonId, $limit, $skip } = params.query;
    const exercises = await super.find(params);
    const lessonExercises = await this.app
      .service("lesson-exercise")
      .Model.find({
        lessonId,
        exerciseId: {
          $in: exercises.data.map((exercise) => exercise._id.toString()),
        },
      })
      .limit($limit)
      .skip($skip)
      .populate("lessonId")
      .populate("exerciseId");
    return {
      ...exercises,
      data: lessonExercises,
    };
  }
};
