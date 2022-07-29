const {
  AuthenticationService,
  JWTStrategy,
} = require("@feathersjs/authentication");
const { LocalStrategy } = require("@feathersjs/authentication-local");
const {
  expressOauth,
  OAuthStrategy,
} = require("@feathersjs/authentication-oauth");
const { Exist409 } = require("./lib/error-handling");

const existAccountChecking = (rawUserData) => {
  return (
    rawUserData !== undefined &&
    rawUserData?.password === process.env.DEFAULT_OAUTH_PASSWORD
  );
};

class GoogleStrategy extends OAuthStrategy {
  async getEntityQuery(profile, params) {
    return { email: profile.email };
  }
  async getEntityData(profile, entity, params) {
    const baseData = await super.getEntityData(profile, entity, params);
    if (params?.existUser) {
      return baseData;
    }
    return {
      ...baseData,
      profilePhoto: {
        url: profile.picture,
      },
      firstName: profile.given_name,
      lastName: profile.family_name,
      email: profile.email,
    };
  }
  async findEntity(profile, params) {
    const entity = await super.findEntity(profile, params);
    params.existUser = !!entity;
    return entity;
  }
  async updateEntity(entity, profile, params) {
    if (!params?.existUser?.googleId) {
      return super.updateEntity(entity, profile, params);
    }
    return params?.existUser;
  }
}
class FacebookStrategy extends OAuthStrategy {
  async getEntityData(profile) {
    const baseData = await super.getEntityData(profile);
    return {
      ...baseData,
      profilePicture: profile.picture,
      email: profile.email,
    };
  }
}
class MyLocalStrategy extends LocalStrategy {
  async authenticate(authentication, params) {
    const rawUserData = await this.entityService.Model.findOne({
      email: authentication?.email,
    });
    if (!!rawUserData && existAccountChecking(rawUserData)) {
      return rawUserData;
    }
    return super.authenticate(authentication, params);
  }
}
class MyAuthenticationService extends AuthenticationService {
  async getPayload(authResults, params) {
    const basePayload = await super.getPayload(authResults, params);
    const { user } = authResults;
    if (user) {
      return {
        ...basePayload,
        role: user?.role,
      };
    }
    return basePayload;
  }
  async authenticate(data, params, ...strategies) {
    const authResult = await super.authenticate(data, params, ...strategies);
    if (existAccountChecking(authResult)) {
      throw new Exist409("Redirect to Oauth page");
    }
    return authResult;
  }
}
module.exports = (app) => {
  const authentication = new MyAuthenticationService(app);

  authentication.register("jwt", new JWTStrategy());
  authentication.register("local", new MyLocalStrategy());
  authentication.register("google", new GoogleStrategy());
  authentication.register("facebook", new FacebookStrategy());

  app.use("/authentication", authentication);
  app.configure(expressOauth());
};
