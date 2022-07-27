const { Service } = require("feathers-mongoose");

exports.LessonExercise = class LessonExercise extends Service {
  setup(app) {
    this.app = app;
  }
  async create(data, params) {
    const { lessonId, order } = data;
    const newExercise = await this.app.service("exercise").create(data);
    await super.create(
      {
        lessonId,
        exerciseId: newExercise._id.toString(),
        order,
      },
      params
    );
    return newExercise;
  }
  async patch(id, data, params) {
    const { exerciseId } = params.query;
    await Promise.all([
      this.app.service("exercise").patch(exerciseId, data, params),
      super.patch(id, data, params),
    ]);
    return "Cập nhật bài tập thành công";
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
