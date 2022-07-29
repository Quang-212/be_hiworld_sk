// user-info-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const modelName = "userInfo";
  const mongooseClient = app.get("mongooseClient");
  const { Schema } = mongooseClient;
  const schema = new Schema(
    {
      coverPhoto: {
        url: { type: String, default: "" },
        id: { type: String, default: "" },
      },
      phone: { type: String, default: "-" },
      gender: { type: String, enum: ["male", "female"] },
      workAt: {
        career: { type: String },
        company: { type: String },
      },
      address: { type: String },
      socialLink: [
        {
          provider: { type: String },
          link: { type: String },
        },
      ],
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
