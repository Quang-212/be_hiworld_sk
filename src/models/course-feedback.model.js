// course-feedback-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const modelName = "courseFeedback";
  const mongooseClient = app.get("mongooseClient");
  const { Schema } = mongooseClient;
  const replySchema = new Schema({
    userId: { type: Schema.Types.ObjectId, required: true, ref: "users" },
    taggedId: { type: Schema.Types.ObjectId, required: true, ref: "users" },
    comment: { type: String, required: true },
  });
  const schema = new Schema(
    {
      userId: { type: Schema.Types.ObjectId, required: true, ref: "users" },
      courseId: { type: Schema.Types.ObjectId, required: true },
      comment: { type: String, required: true },
      rating: { type: Number, required: true },
      reply: [{ type: replySchema, default: null }],
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
