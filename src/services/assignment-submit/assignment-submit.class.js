const { Service } = require("feathers-mongoose");

exports.AssignmentSubmit = class AssignmentSubmit extends Service {
  setup(app) {
    this.app = app;
  }

  async create(data, params) {
    const { user_id, exercise_id } = data;
    const [assignment] = await Promise.all([
      super.create({ user_id, exercise_id }, params),
      this.app
        .service("user-room")
        .create({ user_id, room: `exercise-${exercise_id}` }, params),
    ]);
    return assignment;
  }

  async find(params) {
    const { user_id, exercise_id, type = "all" } = params.query;
    if (type === "one") {
      return await this.Model.findOne({ user_id, exercise_id }).populate(
        "exercise_id"
      );
    }
    return super.find(params);
  }

  async patch(id, data, params) {
    const res = await super.patch(id, data, params);
    return {
      ...res,
      language: Object.keys(data),
      contract_id: data.contract_id,
      typing_user: data.typing_user,
    };
  }
};
