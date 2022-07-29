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
  return (
    params?.authentication?.accessToken &&
    process.env.ADMIN_ROLE.includes(
      decode(params.authentication.accessToken).role
    )
  );
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
      const userInfo = await this.app.service("user-info").create(data, params);
      return super.create({ ...data, userInfo: userInfo._id }, params);
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
            isAdmin(params)
              ? "Email đã được đăng ký qua GG hoặc FB"
              : "Tài khoản của bạn đã đăng nhập trước đó bằng GG hoặc FB!"
          );
        } else if (existEmail) {
          return new Exist409("Email đã tồn tại!");
        }
        return "Redirect to verify page";
      } else {
        if (isAdmin(params)) {
          const userInfo = await this.app
            .service("user-info")
            .create(data, params);
          const user = await super.create(
            { ...data, userInfo: userInfo._id },
            params
          );
          return { ...user, userInfo };
        }
        const aliveCode = await client.get(`code-${email}`);
        if (!aliveCode) {
          return new GeneralError(
            new Error("Mã xác thực của bạn không đúng hoặc đã hết hạn!")
          );
        }
        const userInfo = await this.app
          .service("user-info")
          .create(data, params);
        return super.create({ ...data, userInfo: userInfo._id }, params);
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
      const user = await super.patch(id, data, params);
      const userInfo = await this.app
        .service("user-info")
        .patch(user.userInfo, data, params);
      return { ...user, userInfo };
    }
    const { email } = data;
    try {
      if (isAdmin(params)) {
        console.log("isAdmin");
        const user = await super.patch(id, data, params);
        const userInfo = await this.app
          .service("user-info")
          .patch(user.userInfo, data, params);
        return { ...user, userInfo };
      }

      if ((await isAuthenticated(params, authService, id))?.code) {
        return new Forbidden(
          "Bạn không được phép chỉnh sửa hồ sơ của người khác",
          "block-by-cross-action"
        );
      } else if (await isAuthenticated(params, authService, id)) {
        const user = await super.patch(id, data, params);
        const userInfo = await this.app
          .service("user-info")
          .patch(user.userInfo, data, params);
        return { ...user, userInfo };
      }

      if (queryChecking(params, "checking")) {
        const existEmail = await this.Model.findOne({ email });
        console.log(existEmail);
        if (!existEmail) {
          return new NotFound(
            "Người dùng không tồn tại trong hệ thống!",
            "user-not-exist"
          );
        }
        return "Redirect to verify page";
      } else {
        const aliveCode = client.get(`code-${email}`);
        if (!aliveCode) {
          return new Timeout("Mã xác thực của bạn không đúng hoặc đã hết hạn!");
        }
        if (queryChecking(params, "verify")) {
          return "Redirect to new password page.";
        } else {
          const code = await client.get(`code-${email}`);
          if (code !== data.verifyCode) {
            return new Timeout(new Error("Mã xác thực của bạn hết hạn!"));
          }
          const user = await super.patch(id, data, params);
          await this.app
            .service("user-info")
            .patch(user.userInfo, data, params);
          return "Cập nhật người dùng thành công!";
        }
      }
    } catch (error) {
      return new GeneralError(
        new Error(error || "Xảy ra lỗi hệ thống - Server - Patch - User")
      );
    }
  }
};
