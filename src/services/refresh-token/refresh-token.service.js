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
          const tokenQuantity = await redis.get(
            `token-quantity:${req.body._id}`
          );
          if (+tokenQuantity < 2) {
            res.clearCookie("rf_token");
          }
          return next();
        }
        if (actionChecking(res, "login")) {
          res.cookie("rf_token", await redis.get(`token:${req.body._id}`), {
            httpOnly: true,
            secure: false,
            maxAge: 1000 * 3600 * 24 * 365,
            sameSite: "lax",
          });
          return next();
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
