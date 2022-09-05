const { NotAllowed } = require("../../lib/error-handling");

/* eslint-disable no-unused-vars */
exports.Calling = class Calling {
  constructor(options, app) {
    this.options = options || {};
    this.app = app;
  }

  async find(params) {
    return [];
  }

  async get(id, params) {
    return {
      id,
      text: `A new message with ID: ${id}!`,
    };
  }

  async create(data, params) {
    const members = await this.app.channel(data.room).length;
    if (members < 2) {
      throw new NotAllowed("Không có ai trong phòng!");
    }
    return data;
  }

  async update(id, data, params) {
    return data;
  }

  async patch(id, data, params) {
    return data;
  }

  async remove(id, params) {
    return params.query;
  }
};
