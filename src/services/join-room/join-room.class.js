const { isEmpty } = require("lodash");

/* eslint-disable no-unused-vars */
exports.JoinRoom = class JoinRoom {
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
    return {
      ...data,
      amount: (await this.app.channel(data.room).length) + 1,
    };
  }

  async update(id, data, params) {
    return data;
  }

  async patch(id, data, params) {
    return data;
  }

  async remove(id, params) {
    if (isEmpty(params.query)) {
      throw new Error("Room data is required");
    }
    return {
      ...params.query,
      amount: (await this.app.channel(params.query.room).length) - 1,
    };
  }
};
