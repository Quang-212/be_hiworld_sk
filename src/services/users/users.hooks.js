const { authenticate } = require("@feathersjs/authentication").hooks;
const search = require("../../lib/mongoose-fuzzy-search");
const { hashPassword, protect } =
  require("@feathersjs/authentication-local").hooks;
const { softDelete, disablePagination } = require("feathers-hooks-common");
const adminChecking = require("../../middleware/adminChecking");

module.exports = {
  before: {
    all: [softDelete()],
    find: [authenticate("jwt"), disablePagination(), search],
    get: [authenticate("jwt")],
    create: [hashPassword("password")],
    update: [hashPassword("password"), authenticate("jwt")],
    patch: [hashPassword("password")],
    remove: [authenticate("jwt"), adminChecking],
  },

  after: {
    all: [protect("password")],
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
