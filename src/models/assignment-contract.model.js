// assignment-contract-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const modelName = "assignment_contract";
  const mongooseClient = app.get("mongooseClient");
  const { Schema } = mongooseClient;
  const schema = new Schema(
    {
      sender: { type: Schema.Types.ObjectId, required: true },
      assignment_id: { type: Schema.Types.ObjectId, required: true },
      exercise_id: { type: Schema.Types.ObjectId, required: true },
      status: {
        type: String,
        enum: ["pending", "progressing", "finished"],
        required: true,
        default: "pending",
      },
      is_solved: { type: Boolean, default: false, required: true },
      accepter: { type: Schema.Types.ObjectId, required: true },
      content: { type: String, required: true },
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
