const { GeneralError } = require("@feathersjs/errors");
const { Service } = require("feathers-mongoose");

exports.UserRanking = class UserRanking extends Service {
  setup(app) {
    this.app = app;
  }
  async find(params) {
    try {
      const { type, user } = params.query;
      if (type === "one") {
        return await this.Model.findOne({
          user,
        });
      }

      return super.find(params);
    } catch (error) {
      return new GeneralError(
        error?.message || "Xảy ra lỗi hệ thống - Server - Find - UserRanking"
      );
    }
  }
};
