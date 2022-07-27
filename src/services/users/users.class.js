const { Service } = require("feathers-mongoose");
const { GeneralError } = require("@feathersjs/errors");
const decode = require("jwt-decode");
const { AuthenticationService } = require("@feathersjs/authentication");
const {
  ExistOAuthUser,
  Exist409,
  NotFound,
  Timeout,
  Forbidden,
} = require("../../lib/error-handling");
const { queryChecking } = require("../../utils/query-checking");
const client = require("../../redis");

const isAdmin = (params) => {
  if (params?.authentication && params?.authentication.accessToken) {
    return process.env.ADMIN_ROLE.includes(
      decode(params?.authentication.accessToken)?.role
    );
  }
  return false;
};
const isAuthenticated = async (params, authService, id) => {
  if (params?.authentication && params?.authentication.accessToken) {
    const payload = await authService.verifyAccessToken(
      params?.authentication?.accessToken
    );
    if (payload && payload.sub === id.toString()) {
      return true;
    }
    return { code: 403 };
  }
  return false;
};
exports.Users = class Users extends Service {
  setup(app) {
    this.app = app;
  }
  async create(data, params) {
    if (data?.googleId || data?.facebookId) {
      const newUser = await super.create(data, params);
      await this.app.service("user-info").create({ userId: newUser._id });
      return newUser;
    }
    const { email } = data;
    try {
      if (queryChecking(params, "checking")) {
        const existEmail = await this.Model.findOne({ email });
        if (
          existEmail &&
          existEmail.password === process.env.DEFAULT_OAUTH_PASSWORD
        ) {
          return new ExistOAuthUser(
            "Tài khoản của bạn đã đăng nhập trước đó bằng GG hoặc FB!"
          );
        } else if (existEmail) {
          return new Exist409("Email đã tồn tại!");
        }
        return "Redirect to verify page";
      } else {
        if (isAdmin(params)) {
          const existEmail = await this.Model.findOne({ email });
          if (existEmail)
            return new GeneralError(new Error("Email đã tồn tại!"));
          return await super.create(data, params);
        }
        const aliveCode = await client.get(email);
        if (!aliveCode) {
          return new GeneralError(
            new Error("Mã xác thực của bạn không đúng hoặc đã hết hạn!")
          );
        }
        const newUser = await super.create(data, params);
        await this.app
          .service("user-info")
          .create({ userId: newUser._id, gender: data.gender });
        return newUser;
      }
    } catch (error) {
      return new GeneralError(
        new Error(
          error + "Server - Register" ||
            "Xảy ra lỗi hệ thống - Server - Register"
        )
      );
    }
  }
  async patch(id, data, params) {
    const authService = new AuthenticationService(this.app);

    if (data?.googleId || data?.facebookId) {
      return await super.patch(id, data, params);
    }
    const { email } = data;
    try {
      if (isAdmin(params)) {
        return await super.patch(id, data, params);
      }

      if ((await isAuthenticated(params, authService, id))?.code) {
        return new Forbidden(
          "Bạn không được phép chỉnh sửa hồ sơ của người khác",
          "block-by-cross-action"
        );
      } else if (await isAuthenticated(params, authService, id)) {
        return await super.patch(id, data, params);
      }

      if (queryChecking(params, "checking")) {
        const existEmail = await this.Model.find({ email });
        if (existEmail[0] === undefined) {
          return new NotFound("Người dùng không tồn tại trong hệ thống!");
        }
        return "Redirect to verify page";
      } else {
        const aliveCode = client.get(email);
        if (!aliveCode) {
          return new Timeout("Mã xác thực của bạn không đúng hoặc đã hết hạn!");
        }
        if (queryChecking(params, "verify")) {
          return "Redirect to new password page.";
        } else {
          return await super.patch(id, data, params);
        }
      }
    } catch (error) {
      return new GeneralError(
        new Error(error || "Xảy ra lỗi hệ thống - Server - Patch - User")
      );
    }
  }
};
