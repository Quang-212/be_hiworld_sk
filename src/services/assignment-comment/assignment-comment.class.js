const { Service } = require("feathers-mongoose");

exports.AssignmentComment = class AssignmentComment extends Service {
  async find(params) {
    const originalResult = await super.find(params);
    const reply = await Promise.all(
      originalResult.data.map((item) =>
        this.Model.find({ replyTo: item._id }).exec()
      )
    );
    return {
      ...originalResult,
      data: originalResult.data.map((item, index) => {
        return {
          ...item,
          replyCount: reply[index].length,
        };
      }),
    };
  }
};
