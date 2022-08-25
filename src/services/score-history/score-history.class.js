const { Service } = require("feathers-mongoose");

exports.ScoreHistory = class ScoreHistory extends Service {
  async create(data, params) {
    const { create_type = "one" } = params.query;
    if (create_type === "many") {
      return await this.Model.insertMany(data).exec();
    }
    return super.create(data, params);
  }
};
