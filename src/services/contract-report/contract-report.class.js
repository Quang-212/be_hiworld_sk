const { Service } = require("feathers-mongoose");

exports.ContractReport = class ContractReport extends Service {
  async create(data, params) {
    const response = await super.create(data, params);
    return {
      ...response,
      room: data.room,
    };
  }
};
