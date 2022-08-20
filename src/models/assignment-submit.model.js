// assignment-submit-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const modelName = "assignmentSubmit";
  const mongooseClient = app.get("mongooseClient");
  const { Schema } = mongooseClient;
  const schema = new Schema(
    {
      user_id: { type: Schema.Types.ObjectId, required: true, ref: "users" },
      exercise_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "exercise",
      },
      html: { type: String, default: "" },
      css: { type: String, default: "" },
      js: { type: String, default: "" },
      suggestion_step: { type: Number, default: -1, required: true },
      highest_score: { type: Number, default: 100, required: true },
      submit_time: { type: Date, default: null },
      is_submitted: { type: Boolean, required: true, default: false },
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
