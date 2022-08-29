const { GeneralError } = require("@feathersjs/errors");
const { Service } = require("feathers-mongoose");

exports.UserNotification = class UserNotification extends Service {
  setup(app) {
    this.app = app;
  }

  async create(data, params) {
    try {
      const { room, sender, owner } = data;

      const usersInRoom =
        sender === owner
          ? [{ user_id: sender }]
          : (
              await this.app
                .service("user-room")
                .Model.find({ room })
                .select("user_id")
            ).filter((room) => room.user_id.toString() !== sender);

      await this.Model.insertMany(
        [...new Set(usersInRoom.map((user) => user.user_id.toString()))].map(
          (user_id) => ({
            owner: user_id,
            ...data,
          })
        )
      );

      return { ...data };
    } catch (error) {
      return new Error(error);
    }
  }

  async find(params) {
    try {
      const { contract_status, owner, type, total_unRead } = params.query;
      const queryOptions = [{ owner }, { ...(type !== "all" && { type }) }];

      if (total_unRead) {
        return {
          total_unRead:
            (await this.Model.find({
              owner,
              read: false,
            }).countDocuments()) || 0,
        };
      }

      if (type === "assignment") {
        const contractsByStatus = await this.app
          .service("assignment-contract")
          .Model.find({ status: contract_status });
      }

      if (assignment_status && type) {
        const notification = await this.app
          .service("notification")
          .Model.find({ assignment_status })
          .select("_id");
      }

      return super.find(params);

      //   const notification_id = notification.map((item) => item._id.toString());

      //   return super.find({
      //     ...params,
      //     query: {
      //       $and: [...queryOptions, { notification: { $in: notification_id } }],
      //       ...query,
      //     },
      //   });
      // }

      // if (!assignment_status && type) {
      //   return super.find({
      //     ...params,
      //     query: {
      //       $and: queryOptions,
      //       ...query,
      //     },
      //   });
    } catch (error) {
      return new GeneralError(
        error?.message ||
          "Xảy ra lỗi hệ thống - Server - Find - UserNotification"
      );
    }
  }

  async patch(id, data, params) {
    try {
      const { patch_type = "one" } = params.query;
      if (patch_type === "all") {
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
};
