const { Service } = require("feathers-mongoose");

exports.LessonExercise = class LessonExercise extends Service {
  setup(app) {
    this.app = app;
  }

  async create(data, params) {
    const { lesson, order } = data;
    const _id = this.app.get("mongooseClient").Types.ObjectId();
    const [newExercise, lessonExercise] = await Promise.all([
      this.app.service("exercise").create(
        {
          ...data,
          _id,
        },
        params
      ),
      super.create(
        {
          lesson,
          exercise: _id,
          order,
        },
        params
      ),
    ]);
    return {
      ...lessonExercise,
      lesson: await this.app.service("lesson").get(lesson, params),
      exercise: newExercise,
    };
  }

  async patch(id, data, params) {
    const { exercise, lesson } = params.query;
    const [patchedExercise, patchedLessonExercise] = await Promise.all([
      this.app.service("exercise").patch(exercise, data, params),
      this.Model.findByIdAndUpdate(
        id,
        { ...data, lesson, exercise },
        { new: true }
      ).lean(),
    ]);
    return {
      ...patchedLessonExercise,
      lesson: await this.app.service("lesson").get(lesson, params),
      exercise: patchedExercise,
    };
  }
  async remove(id, params) {
    const { exercise } = params.query;
    await Promise.all([
      this.app.service("exercise").remove(exercise, params),
      super.remove(id, params),
    ]);
    return "Xóa bài tập thành công";
  }
};
