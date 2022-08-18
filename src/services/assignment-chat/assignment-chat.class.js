const redis = require("../../redis");
const { Service } = require("feathers-mongoose");
/* eslint-disable no-unused-vars */

exports.AssignmentChat = class AssignmentChat extends Service {
  setup(app) {
    this.app = app;
  }

  // async find(params) {
  //   const { assignment_id } = params.query;
  //   const conversation = await redis.get(`assignment-chat:${assignment_id}`);
  //   return (conversation && JSON.parse(conversation)) || null;
  // }

  async create(data, params) {
    const members = await this.app.channel(
      `assignment-contract:${data.contract_id}`
    ).length;
    console.log(members);
    if (members === 1) {
      throw new Error("Không có ai trong cuộc trò chuyện!");
    }
    // const _id = this.app.get("mongooseClient").Types.ObjectId();
    try {
      //   const existConversation = await redis.get(
      //     `assignment-chat:${data.assignment_id}`
      //   );
      //   await redis.set(
      //     `assignment-chat:${data.assignment_id}`,
      //     JSON.stringify(
      //       existConversation
      //         ? [
      //             ...JSON.parse(existConversation),
      //             { ...data, _id: _id.toString() },
      //           ]
      //         : [{ ...data, _id: _id.toString() }]
      //     )
      //   );
      // return { ...data, _id: _id.toString() };
      return super.create(data, params);
    } catch (error) {
      return new Error(error);
    }
  }

  // async patch(id, data, params) {
  //   const { assignment_id } = params.query;
  //   try {
  //     const existConversation = await redis.get(
  //       `assignment-chat:${assignment_id}`
  //     );
  //     const patchedConversation = JSON.parse(existConversation).map((item) =>
  //       item._id === id
  //         ? {
  //             ...item,
  //             ...data,
  //           }
  //         : item
  //     );
  //     await redis.set(
  //       `assignment-chat:${data.assignment_id}`,
  //       JSON.stringify(patchedConversation)
  //     );
  //     return {
  //       ...data,
  //       _id: id,
  //     };
  //   } catch (error) {
  //     return new Error(error);
  //   }
  // }
};
