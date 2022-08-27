// Initializes the `contract-report` service on path `/contract-report`
const { ContractReport } = require('./contract-report.class');
const createModel = require('../../models/contract-report.model');
const hooks = require('./contract-report.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/contract-report', new ContractReport(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('contract-report');

  service.hooks(hooks);
};
