// course-feedback-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const modelName = "course_feedback";
  const mongooseClient = app.get("mongooseClient");
  const { Schema } = mongooseClient;

  const schema = new Schema(
    {
      user: { type: Schema.Types.ObjectId, required: true, ref: "users" },
      tag_user: { type: Schema.Types.ObjectId, default: null, ref: "users" },
      course_id: { type: Schema.Types.ObjectId, required: true },
      comment: { type: String, required: true },
      rating: { type: Number, default: null },
      reply_to: {
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
