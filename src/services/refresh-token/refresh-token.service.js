// Initializes the `refresh-token` service on path `/refresh-token`
const client = require("../../redis");
const { RefreshToken } = require("./refresh-token.class");
const hooks = require("./refresh-token.hooks");

module.exports = function (app) {
  const options = {
    paginate: app.get("paginate"),
  };

  // Initialize our service with any options it requires
  app.use(
    "/refresh-token",
    new RefreshToken(options, app),
    async (req, res, next) => {
      try {
        if (
          res.hook.params.query?.logout &&
          JSON.parse(res.hook.params.query?.logout)
        ) {
          res.clearCookie("refreshToken");
          return next();
        }
        res.cookie(
          "refreshToken",
          await client.get(
            `token-${res.hook.params?.provider}-${req.body._id}`
          ),
          {
            httpOnly: true,
            secure: false,
            maxAge: 1000 * 3600 * 24 * 365,
            sameSite: "lax",
          }
        );
        return next();
      } catch (error) {
        next(error);
      }
    }
  );

  // Get our initialized service so that we can register hooks
  const service = app.service("refresh-token");

  service.hooks(hooks);
};
