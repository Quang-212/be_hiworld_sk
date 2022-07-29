const { Service } = require("feathers-mongoose");

exports.LessonExercise = class LessonExercise extends Service {
  setup(app) {
    this.app = app;
  }
  async create(data, params) {
    const { lessonId, order } = data;
    const newExercise = await this.app.service("exercise").create(data, params);
    const lessonExercise = await super.create(
      {
        lessonId,
        exerciseId: newExercise._id.toString(),
        order,
      },
      params
    );
    return {
      ...lessonExercise,
      lessonId: await this.app.service("lesson").get(lessonId, params),
      exerciseId: newExercise,
    };
  }
  async patch(id, data, params) {
    const { exerciseId, lessonId } = params.query;
    const [exercise, lessonExercise] = await Promise.all([
      this.app.service("exercise").patch(exerciseId, data, params),
      super.patch(id, data, params),
    ]);
    return {
      ...lessonExercise,
      lessonId: await this.app.service("lesson").get(lessonId, params),
      exerciseId: exercise,
    };
  }
  async remove(id, params) {
    const { exerciseId } = params.query;
    await Promise.all([
      this.app.service("exercise").remove(exerciseId, params),
      super.remove(id, params),
    ]);
    return "Xóa bài tập thành công";
  }
};
