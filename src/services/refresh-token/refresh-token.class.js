/* eslint-disable no-unused-vars */
const { AuthenticationService } = require("@feathersjs/authentication");
const { GeneralError } = require("@feathersjs/errors");
const { queryChecking } = require("../../utils/query-checking");
const getRefreshToken = require("../../utils/get-refresh-token");
const { NotAuthenticated } = require("../../lib/error-handling");
const client = require("../../redis");
exports.RefreshToken = class RefreshToken {
  constructor(options) {
    this.options = options || {};
  }
  setup(app) {
    this.app = app;
  }

  async find(params) {
    return [];
  }

  async get(id, params) {
    return {
      id,
      text: `A new message with ID: ${id}!`,
    };
  }

  async create(data, params) {
    try {
      const { role, _id } = data;
      const authService = new AuthenticationService(this.app);
      const signRefreshToken = async () => {
        return await authService.createAccessToken(
          {
            sub: _id,
            role,
          },
          {
            expiresIn: process.env.REFRESH_TOKEN_TIME,
          },
          process.env.SECRET_REFRESH_TOKEN
        );
      };
      const newRefreshToken = await signRefreshToken();
      if (queryChecking(params, "login")) {
        await client.set(_id, newRefreshToken, { EX: 3600 * 24 * 365 });
        return "Created refresh token";
      } else {
        const refreshToken = getRefreshToken(params);
        const existRefreshToken = await client.get(_id);
        if (existRefreshToken && existRefreshToken === refreshToken) {
          const payload = await authService.verifyAccessToken(
            refreshToken,
            {
              expiresIn: process.env.REFRESH_TOKEN_TIME,
            },
            process.env.SECRET_REFRESH_TOKEN
          );
          if (payload) {
            const accessToken = await authService.createAccessToken({
              sub: _id,
              role,
            });
            return {
              accessToken,
            };
          }
        } else {
          return new NotAuthenticated("Refresh token expires or modified!");
        }
      }
    } catch (error) {
      return new GeneralError(
        new Error(error + "rf-token-server" || "Lỗi hệ thống!")
      );
    }
  }
  async remove(id, params) {
    try {
      await client.del(params.user._id.toString());
      return "Deleted refresh token";
    } catch (error) {
      return new GeneralError(new Error(error || "Lỗi hệ thống!"));
    }
  }

  async update(id, data, params) {
    return data;
  }

  async patch(id, data, params) {
    return data;
  }
};
