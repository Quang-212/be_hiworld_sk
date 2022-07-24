const adminChecking = require("../../middleware/adminChecking");
const rootChecking = require("../../middleware/rootChecking");
const { authenticate } = require("@feathersjs/authentication").hooks;

module.exports = {
  before: {
    all: [],
    find: [authenticate("jwt"), adminChecking],
    get: [authenticate("jwt"), adminChecking],
    create: [authenticate("jwt"), rootChecking],
    update: [authenticate("jwt"), rootChecking],
    patch: [authenticate("jwt"), rootChecking],
    remove: [authenticate("jwt"), rootChecking],
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
