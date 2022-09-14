// Initializes the `refresh-token` service on path `/refresh-token`
const redis = require("../../redis");
const { RefreshToken } = require("./refresh-token.class");
const hooks = require("./refresh-token.hooks");

module.exports = function (app) {
  const options = {
    paginate: app.get("paginate"),
  };

  // Initialize our service with any options it requires
  const actionChecking = (res, action) =>
    res.hook.params.query[action] && JSON.parse(res.hook.params.query[action]);

  app.use(
    "/refresh-token",
    new RefreshToken(options, app),
    async (req, res, next) => {
      try {
        if (actionChecking(res, "logout")) {
          res.clearCookie("rf_token");
          return next();
        }
        if (actionChecking(res, "login")) {
          const token = await redis.get(`token:${req.body._id}`);
          token &&
            res.cookie("rf_token", token, {
              httpOnly: true,
              secure: false,
              maxAge: 1000 * 3600 * 24 * 365,
              sameSite: "lax",
            });
        }
        return next();
      } catch (error) {
        return next(error);
      }
    }
  );

  // Get our initialized service so that we can register hooks
  const service = app.service("refresh-token");

  service.hooks(hooks);
};
