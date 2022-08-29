const redis = require("../../redis");
const { Service } = require("feathers-mongoose");
const { NotAllowed } = require("../../lib/error-handling");

/* eslint-disable no-unused-vars */
exports.AssignmentContract = class AssignmentContract extends Service {
  setup(app) {
    this.app = app;
  }

  async find(params) {
    try {
      const { assignment_id, find_type = null, user_id } = params.query;

      if (find_type === "temporary") {
        const contract = await redis.get(
          `assignment-contract:${assignment_id}`
        );
        return (contract && JSON.parse(contract)) || null;
      }

      if (find_type === "progressing") {
        return await this.Model.findOne({
          $and: [
            { $or: [{ sender: user_id }, { accepter: user_id }] },
            { type: "progressing" },
          ],
        }).exec();
      }
      return super.find(params);
    } catch (error) {
      return new Error(error);
    }
  }

  async patch(id, data, params) {
    try {
      const { patch_type = null } = params.query;

      const { assignment_id, accepter = null } = data;
      const existing = await redis.get(`assignment-contract:${assignment_id}`);
      if (!existing) {
        return {
          code: 404,
        };
      }

      const contract = existing && JSON.parse(existing);
      if (patch_type === "accept_contract") {
        const contract = await this.Model.findById(id);
        if (contract?.helper) {
          throw new NotAllowed("Đã có người giúp đỡ trước đó");
        }
        await this.Model.findByIdAndUpdate(
          id,
          { status: "progressing" },
          { new: true }
        );
        return "assignment-contract-patch-OK";
      }

      return super.patch(id, data, params);

      // if (existing && contract._id === id) {
      //   await Promise.all([
      //     super.create(
      //       {
      //         ...contract,
      //         accepter,
      //         status: "progressing",
      //       },
      //       params
      //     ),
      //     redis.del(`assignment-contract:${assignment_id}`),
      //   ]);
      //   return { code: 200 };
      // }
    } catch (error) {
      return new Error(error);
    }
  }
  async create(data, params) {
    const { assignment_id } = data;
    try {
      const solvingContract = await this.Model.findOne({
        assignment_id,
        status: "progressing",
      }).exec();

      if (solvingContract) {
        return {
          code: 409,
          ttl: solvingContract.createdAt,
        };
      }

      return super.create(data, params);
    } catch (error) {
      return new Error(error);
    }
  }
};
