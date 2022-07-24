const { authenticate } = require("@feathersjs/authentication").hooks;
const { softDelete, disablePagination } = require("feathers-hooks-common");
const search = require("../../lib/mongoose-fuzzy-search");
const adminChecking = require("../../middleware/adminChecking");

module.exports = {
  before: {
    all: [],
    find: [disablePagination(), search],
    get: [authenticate("jwt"), adminChecking],
    create: [authenticate("jwt"), adminChecking],
    update: [authenticate("jwt"), adminChecking],
    patch: [authenticate("jwt"), adminChecking],
    remove: [authenticate("jwt"), adminChecking, softDelete()],
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
