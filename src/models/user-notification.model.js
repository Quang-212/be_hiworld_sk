// user-notification-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const modelName = "userNotification";
  const mongooseClient = app.get("mongooseClient");
  const { Schema } = mongooseClient;
  const schema = new Schema(
    {
      owner: { type: Schema.Types.ObjectId, required: true, ref: "users" },
      sender: { type: Schema.Types.ObjectId, required: true, ref: "users" },
      type: {
        type: String,
        enum: ["assignment", "course-comment", "lesson-comment"],
        required: true,
      },
      title: { type: String, required: true },
      message: { type: String, required: true },
      notification: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "notification",
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
