const { FeathersError } = require("@feathersjs/errors");

class ExistOAuthUser extends FeathersError {
  constructor(message, data) {
    super(message, "NotAuthenticated", 301, "exist-oauth-user", data);
  }
}
class NotAuthenticated extends FeathersError {
  constructor(message, data) {
    super(message, "NotAuthenticated", 401, "token-invalid", data);
  }
}
class Forbidden extends FeathersError {
  constructor(message, className, data) {
    super(message, "Forbidden", 403, className, data);
  }
}
class Exist409 extends FeathersError {
  constructor(message, data) {
    super(message, "Conflict", 409, "already-exist", data);
  }
}
class NotFound extends FeathersError {
  constructor(message, className, data) {
    super(message, "NotFound", 404, className, data);
  }
}
class Timeout extends FeathersError {
  constructor(message, data) {
    super(message, "Timeout", 408, "time-out", data);
  }
}
module.exports = {
  ExistOAuthUser,
  Exist409,
  NotFound,
  Timeout,
  NotAuthenticated,
  Forbidden,
};
