const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const codeContent = require("../../mail-verify");
const redis = require("../../redis");

exports.Mailer = class Mailer {
  constructor(options) {
    this.options = options || {};
  }
  async create(data, params) {
    const { email } = data;
    const code = Math.random()
      .toString()
      .slice(2, 2 + 6);
    // 6 is length of verify code
    const OAuth2 = google.auth.OAuth2;
    const OAuth2_client = new OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );
    OAuth2_client.setCredentials({
      refresh_token: process.env.GOOGLE_EMAIL_RF_TOKEN,
    });
    const accessToken = await OAuth2_client.getAccessToken();
    const transport = nodemailer.createTransport({
      host: "smtp.gmail.com",
      service: "Gmail",
      port: 465,
      secure: true,
      auth: {
        type: "OAuth2",
        user: process.env.SECRET_EMAIL,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_EMAIL_RF_TOKEN,
        accessToken: accessToken.token,
      },
    });
    const codeVerifyContent = codeContent(code, email);
    try {
      await transport.sendMail({
        from: process.env.SECRET_EMAIL,
        to: email,
        subject: "Verify message from Education web app",
        html: codeVerifyContent,
      });
      return await redis.set(email, code, "EX", 60 * 10);
    } catch (err) {
      return err;
    }
  }
};
