// users-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html

const { Schema } = require("mongoose");

// for more of what you can do here.
module.exports = function (app) {
  const modelName = "users";
  const mongooseClient = app.get("mongooseClient");
  const schema = new mongooseClient.Schema(
    {
      googleId: { type: String, default: "" },
      facebookId: { type: String, default: "" },
      firstName: { type: String, required: true, lowercase: true },
      lastName: { type: String, required: true, lowercase: true },
      search: { type: String, required: true, lowercase: true },
      profilePhoto: {
        url: { type: String, default: "" },
        id: { type: String, default: "" },
      },
      email: { type: String, lowercase: true, unique: true },
      password: {
        type: String,
        required: true,
        default: process.env.DEFAULT_OAUTH_PASSWORD,
      },
      role: { type: String, required: true, default: "newbie" },
      userInfo: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "userInfo",
      },
      deleted: { type: Boolean, default: false },
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
