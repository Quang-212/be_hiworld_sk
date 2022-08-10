const { GeneralError } = require("@feathersjs/errors");
const { Service } = require("feathers-mongoose");

exports.UserNotification = class UserNotification extends Service {
  setup(app) {
    this.app = app;
  }
  async patch(id, data, params) {
    try {
      const { type } = params.query;
      if (type === "all") {
        return await this.Model.updateMany({ user_id: data.user_id }, data);
      }
      return await super.patch(id, data, params);
    } catch (error) {
      return new GeneralError(
        new Error(
          error || "Xảy ra lỗi hệ thống - Server - Patch - UserNotification"
        )
      );
    }
  }
};
