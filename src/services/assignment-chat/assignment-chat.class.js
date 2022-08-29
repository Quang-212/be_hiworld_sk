const redis = require("../../redis");
const { Service } = require("feathers-mongoose");
/* eslint-disable no-unused-vars */

exports.AssignmentChat = class AssignmentChat extends Service {
  setup(app) {
    this.app = app;
  }
  async create(data, params) {
    const members = await this.app.channel(
      `assignment-contract:${data.contract_id}`
    ).length;
    if (members === 1) {
      throw new Error("Không có ai trong cuộc trò chuyện!");
    }
    return super.create(data, params);
  }
};
