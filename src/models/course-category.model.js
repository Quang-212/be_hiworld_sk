// course-category-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const modelName = "course_category";
  const mongooseClient = app.get("mongooseClient");
  const { Schema } = mongooseClient;
  const schema = new Schema(
    {
      name: { type: String, required: true, lowercase: true },
      search: { type: String, required: true, lowercase: true },
      parent_id: {
        type: Schema.Types.ObjectId,
        ref: "course_category",
        default: null,
      },
      slug: { type: String, required: true, lowercase: true },
      deleted: { type: Boolean, default: false },
    },
    {
      timestamps: true,
    }
  );

  schema.index({ name: "text" });
  // This is necessary to avoid model compilation errors in watch mode
  // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
  if (mongooseClient.modelNames().includes(modelName)) {
    mongooseClient.deleteModel(modelName);
  }
  return mongooseClient.model(modelName, schema);
};
