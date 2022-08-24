// contract-report-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const modelName = "contract_report";
  const mongooseClient = app.get("mongooseClient");
  const { Schema } = mongooseClient;
  const schema = new Schema(
    {
      sender: { type: Schema.Types.ObjectId, required: true },
      contract: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "assignment_contract",
      },
      type: {
        type: String,
        enum: ["success", "leave", "report"],
        required: true,
      },
      content: { type: String },
      is_accepted: { type: Boolean, default: false, required: true },
      is_verified: { type: Boolean },
      report_confirmed: { type: Boolean },
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
