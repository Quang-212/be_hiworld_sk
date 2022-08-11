const redis = require("../../redis");

/* eslint-disable no-unused-vars */
exports.AssignmentContract = class AssignmentContract {
  constructor(options) {
    this.options = options || {};
  }
  setup(app) {
    this.app = app;
  }

  async find(params) {
    const { assignmentId } = params.query;
    const contract = await redis.get(`assignment-contract:${assignmentId}`);
    return (contract && JSON.parse(contract)) || null;
  }

  async get(id, params) {
    return id;
  }

  async patch(id, data, params) {
    try {
      const { assignmentId, notificationId, accepter } = data;
      const existing = await redis.get(`assignment-contract:${assignmentId}`);
      if (existing) {
        const contract = JSON.parse(existing);
        console.log(contract);
        if (contract.accepter) {
          return {
            code: 409,
          };
        }
        await Promise.all([
          redis.set(
            `assignment-contract:${assignmentId}`,
            JSON.stringify({
              ...contract,
              accepter,
            })
          ),
          this.app
            .service("notification")
            .Model.findByIdAndUpdate(notificationId, {
              assignment_status: "solving",
            })
            .exec(),
        ]);
      }
      return { code: 200 };
    } catch (error) {
      return { code: 500 };
    }
  }
  async create(data, params) {
    const { assignmentId } = data;
    const existing = await redis.get(`assignment-contract:${assignmentId}`);
    if (existing) {
      return {
        code: 409,
        ttl: await redis.ttl(`assignment-contract:${assignmentId}`),
      };
    }
    await redis.set(
      `assignment-contract:${assignmentId}`,
      JSON.stringify(data),
      "EX",
      60 * 10
    );
    return { code: 200 };
  }

  async update(id, data, params) {
    return data;
  }

  async remove(id, params) {
    return { id };
  }
};
