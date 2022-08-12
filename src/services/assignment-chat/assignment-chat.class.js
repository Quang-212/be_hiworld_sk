const redis = require("../../redis");

/* eslint-disable no-unused-vars */
exports.AssignmentChat = class AssignmentChat {
  constructor(options) {
    this.options = options || {};
  }
  setup(app) {
    this.app = app;
  }

  async find(params) {
    const { assignment_id } = params.query;
    const conversation = await redis.get(`assignment-chat:${assignment_id}`);
    return (conversation && JSON.parse(conversation)) || null;
  }

  async get(id, params) {
    return {
      id,
      text: `A new message with ID: ${id}!`,
    };
  }

  async create(data, params) {
    const _id = this.app.get("mongooseClient").Types.ObjectId();
    try {
      const existConversation = await redis.get(
        `assignment-chat:${data.assignment_id}`
      );
      await redis.set(
        `assignment-chat:${data.assignment_id}`,
        JSON.stringify(
          existConversation
            ? [
                ...JSON.parse(existConversation),
                { ...data.content, _id: _id.toString() },
              ]
            : [{ ...data.content, _id: _id.toString() }]
        )
      );
      return { ...data.content, _id: _id.toString() };
    } catch (error) {
      return { code: 500 };
    }
  }

  async update(id, data, params) {
    return data;
  }

  async patch(id, data, params) {
    const { assignment_id } = params.query;
    try {
      const existConversation = await redis.get(
        `assignment-chat:${assignment_id}`
      );
      const patchedConversation = JSON.parse(existConversation).map((item) =>
        item._id === id
          ? {
              ...item,
              ...data,
            }
          : item
      );
      await redis.set(
        `assignment-chat:${data.assignment_id}`,
        JSON.stringify(patchedConversation)
      );
      return {
        ...data,
        _id: id,
      };
    } catch (error) {
      return { code: 500 };
    }
  }

  async remove(id, params) {
    return { id };
  }
};
