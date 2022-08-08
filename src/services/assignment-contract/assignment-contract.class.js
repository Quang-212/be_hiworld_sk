const redis = require("../../redis");

/* eslint-disable no-unused-vars */
exports.AssignmentContract = class AssignmentContract {
  constructor(options) {
    this.options = options || {};
  }

  async find(params) {
    const { assignmentId } = params.query;
    return (
      (await (redis.get(`assignment-contract-${assignmentId}`) &&
        JSON.parse(redis.get(`assignment-contract-${assignmentId}`)))) || null
    );
  }

  async get(id, params) {
    return id;
  }

  async create(data, params) {
    const { assignmentId } = data;
    const existing = await redis.get(`assignment-contract-${assignmentId}`);
    if (existing) {
      return {
        code: 409,
      };
    }
    await redis.set(
      `assignment-contract-${assignmentId}`,
      JSON.stringify(data)
    );
    return { code: 200 };
  }

  async update(id, data, params) {
    return data;
  }

  async patch(id, data, params) {
    return data;
  }

  async remove(id, params) {
    return { id };
  }
};
