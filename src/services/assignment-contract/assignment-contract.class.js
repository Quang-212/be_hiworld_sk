const redis = require("../../redis");
const { Service } = require("feathers-mongoose");

/* eslint-disable no-unused-vars */
exports.AssignmentContract = class AssignmentContract extends Service {
  setup(app) {
    this.app = app;
  }

  async find(params) {
    try {
      const {
        temporary = true,
        assignment_id,
        find_type = "all",
        user_id,
      } = params.query;

      if (temporary) {
        const contract = await redis.get(
          `assignment-contract:${assignment_id}`
        );
        return (contract && JSON.parse(contract)) || null;
      }

      if (find_type === "one") {
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
      const { assignment_id, notification_id, accepter = null } = data;
      const existing = await redis.get(`assignment-contract:${assignment_id}`);
      if (!existing) {
        return {
          code: 404,
        };
      }
      const contract = existing && JSON.parse(existing);
      if (contract.accepter) {
        return {
          code: 409,
        };
      }
      if (existing && contract._id === id) {
        await Promise.all([
          super.create(
            {
              ...contract,
              accepter,
              status: "progressing",
            },
            params
          ),
          redis.del(`assignment-contract:${assignment_id}`),
          this.app
            .service("notification")
            .Model.findByIdAndUpdate(notification_id, {
              assignment_status: "progressing",
            })
            .exec(),
        ]);
      }
      return { code: 200 };
    } catch (error) {
      return new Error(error);
    }
  }
  async create(data, params) {
    const { assignment_id } = data;
    try {
      const [redis_assignment, mongo_assignment] = await Promise.all([
        redis.get(`assignment-contract:${assignment_id}`),
        this.Model.find({ assignment_id }).exec(),
      ]);
      const solvingAssignment = mongo_assignment.find(
        (assignment) => assignment.status === "progressing"
      );
      if (redis_assignment) {
        return {
          code: 409,
          source: "redis",
          ttl: await redis.ttl(`assignment-contract:${assignment_id}`),
        };
      }
      if (solvingAssignment) {
        return {
          code: 409,
          source: "mongo",
        };
      }
      const new_id = this.app.get("mongooseClient").Types.ObjectId();
      const contractTime = 60 * 10;
      await redis.set(
        `assignment-contract:${assignment_id}`,
        JSON.stringify({
          ...data,
          _id: new_id,
        }),
        "EX",
        contractTime
      );
      return {
        ...data,
        _id: new_id,
      };
    } catch (error) {
      return new Error(error);
    }
  }
};
