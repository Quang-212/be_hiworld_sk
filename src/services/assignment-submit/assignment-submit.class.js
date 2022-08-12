const { Service } = require("feathers-mongoose");

exports.AssignmentSubmit = class AssignmentSubmit extends Service {
  setup(app) {
    this.app = app;
  }

  async create(data, params) {
    const { userId, exerciseId } = data;
    const [assignment] = await Promise.all([
      this.Model.create({ userId, exerciseId }),
      this.app
        .service("user-room")
        .create({ userId, name: `exercise-${exerciseId}` }, params),
    ]);
    return assignment;
  }

  async find(params) {
    const { userId, exerciseId, type = "all" } = params.query;
    if (type === "one") {
      return await this.Model.findOne({ userId, exerciseId });
    }
    return super.find(params);
  }
  async patch(id, data, params) {
    const res = await super.patch(id, data, params);
    return {
      ...res,
      language: Object.keys(data),
    };
  }
};
