// friendship-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html

const { SchemaType } = require("mongoose");

// for more of what you can do here.
module.exports = function (app) {
  const modelName = "friendship";
  const mongooseClient = app.get("mongooseClient");
  const { Schema } = mongooseClient;
  const schema = new Schema(
    {
      requestId: { type: Schema.Types.ObjectId, ref: "users", required: true },
      receiveId: { type: Schema.Types.ObjectId, ref: "users", required: true },
      status: {
        type: String,
        enum: ["pending", "accepted"],
        default: "pending",
      },
      rejected: { type: Date },
      relationship: {
        type: String,
        enum: ["friend", "family", "colleague", "lover", "other"],
        default: "friend",
      },
    },
    {
      timestamps: true,
    }
  );
  schema.index({ rejected: 1 }, { expireAfterSeconds: 0 });
  // This is necessary to avoid model compilation errors in watch mode
  // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
  if (mongooseClient.modelNames().includes(modelName)) {
    mongooseClient.deleteModel(modelName);
  }
  return mongooseClient.model(modelName, schema);
};
