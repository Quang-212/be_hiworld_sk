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
      const { assignment_id, find_type = null } = params.query;

      if (find_type === "temporary") {
        const contract = await redis.get(
          `assignment-contract:${assignment_id}`
        );
        return (contract && JSON.parse(contract)) || null;
      }

      return super.find(params);
    } catch (error) {
      return new Error(error);
    }
  }
  async get(id, params) {
    const { get_type = null } = params.query;

    if (get_type === "countMember") {
      const [membersCount, contract] = await Promise.all([
        this.app.channel(`assignment-contract:${id}`).length,
        this.Model.findById(id).exec(),
      ]);
      return {
        membersCount,
        status: contract?.status,
      };
    }

    return super.get(id, params);
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
      const response = await super.patch(id, data, params);
      return {
        ...response,
        membersCount: await this.app.channel(`assignment-contract:${id}`),
      };
    } catch (error) {
      return new Error(error);
    }
  }
  async create(data, params) {
    const { assignment_id } = data;

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
