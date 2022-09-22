// exercise-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const modelName = "exercise";
  const mongooseClient = app.get("mongooseClient");
  const { Schema } = mongooseClient;
  const schema = new Schema(
    {
      name: { type: String, required: true },
      search: { type: String, required: true, lowercase: true },
      slug: { type: String, required: true },
      difficulty: {
        type: String,
        enum: ["easy", "medium", "hard"],
        required: true,
      },
      target: {
        type: String,
        enum: ["challenge", "exercise"],
        required: true,
        default: "challenge",
      },
      type: {
        type: String,
        enum: ["javascript", "task", "quiz", "algorithm", "coding"],
        required: true,
      },
      plus_score: { type: Number, required: true, default: 100 },
      requirement: { type: String, required: true },
      code_rules: { type: String },
      options: { type: String },
      result: { type: String, required: true },
      deleted: { type: Boolean, default: false, required: true },
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
