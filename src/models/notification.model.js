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
      //custom data for notification
      room: { type: String, required: true }, // room name
      // assignment_id: { type: Schema.Types.ObjectId }, // assignment id
      // contract_status: { type: String, enum: [] },
      exercise_type: { type: String }, //exercise type
      // contract_id: { type: Schema.Types.ObjectId }, // assignment contract id
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
