const { Service } = require("feathers-mongoose");

exports.Notification = class Notification extends Service {
  setup(app) {
    this.app = app;
  }
  async create(data, params) {}
};
