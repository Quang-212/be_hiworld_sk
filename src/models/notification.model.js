// notification-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const modelName = "notification";
  const mongooseClient = app.get("mongooseClient");
  const { Schema } = mongooseClient;
  const schema = new Schema(
    {
      sender: { type: Schema.Types.ObjectId, required: true, ref: "users" },
      title: { type: String, required: true },
      type: {
        type: String,
        enum: ["assignment", "course-comment", "lesson-comment"],
        required: true,
      },
      assignment_status: {
        type: String,
        enum: ["pending", "solving", "solved"],
      },
      room: { type: String, required: true }, // room name
      message: { type: String },
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
