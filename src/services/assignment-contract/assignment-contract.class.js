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
            { $or: [{ sender: user_id }, { helper: user_id }] },
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
      const { assignment_id, helper = null } = data;
      const { patch_type = null } = params.query;

      if (patch_type === "accept_contract") {
        const redisContract = await redis.get(
          `assignment-contract:${assignment_id}`
        );
        if (!redisContract) {
          return {
            code: 404,
          };
        }

        const solvingContract = await this.Model.findOne({
          assignment_id,
          status: "progressing",
        });

        if (solvingContract) {
          return {
            code: 405,
          };
        }
        await Promise.all([
          redis.del(`assignment-contract:${assignment_id}`),
          this.Model.findByIdAndUpdate(id, {
            status: "progressing",
            helper,
          }),
        ]);
        return { code: 200 };
      }
      return super.patch(id, data, params);
    } catch (error) {
      return new Error(error);
    }
  }
  async create(data, params) {
    const { assignment_id } = data;

    console.log(assignment_id);

    try {
      const [waitingContract, solvingContract] = await Promise.all([
        redis.get(`assignment-contract:${assignment_id}`),
        this.Model.findOne({ assignment_id }),
      ]);

      if (waitingContract) {
        return {
          code: 405,
          source: "redis",
          ttl: await redis.ttl(`assignment-contract:${assignment_id}`),
        };
      }

      if (solvingContract?.status === "progressing") {
        return {
          code: 405,
          source: "mongo",
        };
      }

      if (solvingContract?.status === "pending") {
        await this.Model.findByIdAndUpdate(solvingContract._id, {
          status: "timeout",
        });
      }

      const _id = this.app.get("mongooseClient").Types.ObjectId();

      const contractWaitingTime = 60 * 10;
      await redis.set(
        `assignment-contract:${assignment_id}`,
        JSON.stringify({ ...data, _id }),
        "EX",
        contractWaitingTime
      );
      return await super.create({ ...data, _id }, params);
    } catch (error) {
      console.log(error);
      return new Error(error);
    }
  }
};
