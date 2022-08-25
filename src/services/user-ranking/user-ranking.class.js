const { GeneralError } = require("@feathersjs/errors");
const { Service } = require("feathers-mongoose");
const { NotAllowed } = require("../../lib/error-handling");

exports.UserRanking = class UserRanking extends Service {
  setup(app) {
    this.app = app;
  }

  async find(params) {
    try {
      const { find_type, user } = params.query;
      if (find_type === "one") {
        return await this.Model.findOne({
          user,
        }).exec();
      }

      return super.find(params);
    } catch (error) {
      return new GeneralError(
        error?.message || "Xảy ra lỗi hệ thống - Server - Find - UserRanking"
      );
    }
  }

  async patch(id, data, params) {
    const { score_type, user } = params.query;
    const availableScore =
      (await this.Model.findOne({ user }).exec()).score > data.amount;
    if (!availableScore) {
      throw new NotAllowed("Không đủ điểm");
    }

    if (score_type) {
      return await this.Model.findOneAndUpdate(
        { user },
        { $inc: { score: score_type === "minus" ? -data.amount : data.amount } }
      ).exec();
    }
    return super.patch(id, data, params);
  }
};
