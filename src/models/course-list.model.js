// course-list-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const modelName = "course_list";
  const mongooseClient = app.get("mongooseClient");
  const { Schema } = mongooseClient;
  const schema = new Schema(
    {
      title: { type: String, required: true, lowerCase: true },
      sub_title: { type: String, required: true },
      search: { type: String, required: true, lowercase: true },
      slug: { type: String, required: true },
      category: {
        type: Schema.Types.ObjectId,
        ref: "course_category",
        required: true,
      },
      description: { type: String, required: true },
      thumbnail: {
        url: { type: String, require: true },
        id: { type: String, require: true },
      },
      level: {
        type: String,
        enum: {
          values: ["Beginner", "Skilled", "Proficient", "Advanced"],
          message: "{VALUE} level is not supported",
        },
        required: true,
      },
      register: { type: Number, required: true, default: 0 },
      share: { type: Number, required: true, default: 0 },
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
