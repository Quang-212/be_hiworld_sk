const { GeneralError } = require("@feathersjs/errors");
const { Service } = require("feathers-mongoose");

exports.UserNotification = class UserNotification extends Service {
  async patch(id, data, params) {
    try {
      const { type = "one" } = params.query;
      if (type === "all") {
        return await this.Model.updateMany({ user_id: data.user_id }, data);
      }
      return super.patch(id, data, params);
    } catch (error) {
      return new GeneralError(
        error?.message ||
          "Xảy ra lỗi hệ thống - Server - Patch - UserNotification"
      );
    }
  }
};
