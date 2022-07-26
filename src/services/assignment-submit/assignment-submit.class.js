const { Service } = require("feathers-mongoose");

exports.AssignmentSubmit = class AssignmentSubmit extends Service {
  setup(app) {
    this.app = app;
  }

  async create(data, params) {
    const { user, exercise } = data;
    const [assignment] = await Promise.all([
      super.create({ user, exercise }, params),
      this.app
        .service("user-room")
        .create({ user_id: user, room: `exercise-${exercise}` }, params),
    ]);
    return assignment;
  }

  async patch(id, data, params) {
    const { suggestion_step } = data;
    const { patch_type } = params.query;
    if (patch_type === "call_help") {
      return this.Model.findByIdAndUpdate(id, { $inc: { suggestion_step: 1 } });
    }
    if (suggestion_step) {
      return await this.Model.findByIdAndUpdate(id, data, { new: true }).select(
        "suggestion_step"
      );
    }

    const res = await super.patch(id, data, params);
    return {
      ...res,
      language: Object.keys(data),
      contract_id: data.contract_id,
    };
  }
};
