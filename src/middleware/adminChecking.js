const decode = require("jwt-decode");
const { Forbidden } = require("../lib/error-handling");

module.exports = function adminChecking(context) {
  const token = context.params.headers.authorization.split(" ")[1];
  if (token && !process.env.ADMIN_ROLE.includes(decode(token)?.role)) {
    throw new Forbidden(
      "Hành động này phải được thực hiện bởi ADMIN",
      "access-denied"
    );
  }
  return context;
};
