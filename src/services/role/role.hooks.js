const { softDelete, disablePagination } = require("feathers-hooks-common");
const search = require("../../lib/mongoose-fuzzy-search");
const adminChecking = require("../../middleware/adminChecking");
const rootChecking = require("../../middleware/rootChecking");
const { authenticate } = require("@feathersjs/authentication").hooks;

module.exports = {
  before: {
    all: [softDelete(), authenticate("jwt")],
    find: [disablePagination(), adminChecking, search],
    get: [adminChecking],
    create: [rootChecking],
    update: [rootChecking],
    patch: [rootChecking],
    remove: [rootChecking],
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};
