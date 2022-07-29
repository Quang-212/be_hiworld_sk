// lesson-exercise-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const modelName = "lessonExercise";
  const mongooseClient = app.get("mongooseClient");
  const { Schema } = mongooseClient;
  const schema = new Schema(
    {
      lessonId: { type: Schema.Types.ObjectId, required: true, ref: "lesson" },
      exerciseId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "exercise",
      },
      order: { type: Number, required: true, default: 0 }, // exercise order in the lesson
      deleted: { type: Boolean, default: false },
    },
    {
      timestamps: true,
    }
  );

  // This is necessary to avoid model compilation errors in watch mode
  // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
  if (mongooseClient.modelNames().includes(modelName)) {
    mongooseClient.deleteModel(modelName);
  }
  return mongooseClient.model(modelName, schema);
};
