const { GeneralError } = require("@feathersjs/errors");
const { Service } = require("feathers-mongoose");

exports.UserNotification = class UserNotification extends Service {
  setup(app) {
    this.app = app;
  }
  async patch(id, data, params) {
    try {
      const { type = "one" } = params.query;
      if (type === "all") {
        return await this.Model.updateMany({ owner: data.owner }, data);
      }
      return await this.Model.findByIdAndUpdate(id, data);
    } catch (error) {
      return new GeneralError(
        error?.message ||
          "Xảy ra lỗi hệ thống - Server - Patch - UserNotification"
      );
    }
  }

  async find(params) {
    try {
      const { query } = params;
      const { assignment_status, owner, type, totalUnRead } = query;
      const queryOptions = [{ owner }, { ...(type !== "all" && { type }) }];

      if (totalUnRead) {
        return {
          totalUnRead:
            (await this.Model.find({
              owner,
              read: false,
            }).countDocuments()) || 0,
        };
      }

      if (assignment_status && type) {
        const notification = await this.app
          .service("notification")
          .Model.find({ assignment_status })
          .select("_id");

        const notification_id = notification.map((item) => item._id.toString());

        return super.find({
          ...params,
          query: {
            $and: [...queryOptions, { notification: { $in: notification_id } }],
            ...query,
          },
        });
      }

      if (!assignment_status && type) {
        return super.find({
          ...params,
          query: {
            $and: queryOptions,
            ...query,
          },
        });
      }

      return super.find(params);
    } catch (error) {
      return new GeneralError(
        error?.message ||
          "Xảy ra lỗi hệ thống - Server - Find - UserNotification"
      );
    }
  }
};
