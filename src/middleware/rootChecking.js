const decode = require("jwt-decode");
const { Forbidden } = require("../lib/error-handling");

module.exports = function rootChecking(context) {
  const token = context.params.headers.authorization.split(" ")[1];
  if (token && !decode(token)?.role?.includes("root")) {
    throw new Forbidden(
      "Hành động này chỉ được thực hiện bởi ROOT-THO_TRAN",
      "access-denied"
    );
  }
  return context;
};
