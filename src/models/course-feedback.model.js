// course-feedback-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const modelName = "courseFeedback";
  const mongooseClient = app.get("mongooseClient");
  const { Schema } = mongooseClient;

  const schema = new Schema(
    {
      userId: { type: Schema.Types.ObjectId, required: true, ref: "users" },
      tagId: { type: Schema.Types.ObjectId, default: null },
      courseId: { type: Schema.Types.ObjectId, default: null },
      comment: { type: String, required: true },
      rating: { type: Number, default: null },
      replyTo: {
        type: Schema.Types.ObjectId,
        default: null,
      },
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
