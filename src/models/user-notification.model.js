// user-notification-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const modelName = "user_notification";
  const mongooseClient = app.get("mongooseClient");
  const { Schema } = mongooseClient;
  const schema = new Schema(
    {
      owner: { type: Schema.Types.ObjectId, required: true, ref: "users" }, // thong bao nay thuoc ve ai
      sender: { type: Schema.Types.ObjectId, required: true, ref: "users" }, // thong bao duoc gui tu ai
      type: {
        type: String,
        enum: ["app", "assignment", "course-comment", "lesson-comment"],
        required: true,
      },
      title: { type: String, required: true },
      message: { type: String, required: true },
      contract: {
        type: Schema.Types.ObjectId,
        ref: "assignment_contract",
      },
      read: { type: Boolean, required: true, default: false },
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
