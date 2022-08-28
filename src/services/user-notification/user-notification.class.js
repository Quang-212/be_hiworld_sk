const { GeneralError } = require("@feathersjs/errors");
const { Service } = require("feathers-mongoose");

exports.UserNotification = class UserNotification extends Service {
  setup(app) {
    this.app = app;
  }
  async patch(id, data, params) {
    try {
      const { patch_type = "one", owner } = params.query;
      if (patch_type === "all") {
        return await this.Model.updateMany({ owner }, data);
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
      const { contract_status, owner, type, total_unRead, $limit, $skip } =
        params.query;

      if (total_unRead) {
        return {
          total_unRead:
            (await this.Model.find({
              owner,
              read: false,
            }).countDocuments()) || 0,
        };
      }

      if (contract_status && type) {
        const contractsByStatus = await this.app
          .service("assignment-contract")
          .Model.find({ status: contract_status })
          .select("_id")
          .sort({
            createdAt: -1,
          })
          .limit($limit)
          .skip($skip);

        const contractIds = contractsByStatus.map((contract) =>
          contract._id.toString()
        );

        return super.find({
          ...params,
          query: {
            contract: { $in: contractIds },
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
