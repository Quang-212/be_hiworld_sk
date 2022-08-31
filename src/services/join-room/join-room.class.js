const { isEmpty } = require("lodash");
const redis = require("../../redis");

/* eslint-disable no-unused-vars */
const getCurrentMembersCount = (channel) => {
  return (
    [
      ...new Set(
        channel.connections.map((connection) => connection.user._id.toString())
      ),
    ].length || 0
  );
};
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
    const existsRoom = redis.exists(`room:${data.room}`);
    return {
      ...data,
      amount: getCurrentMembersCount(this.app.channel(data.room)) + 1,
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
      amount: getCurrentMembersCount(this.app.channel(params.query.room)) - 1,
    };
  }
};
