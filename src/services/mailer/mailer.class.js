const nodemailer = require("nodemailer");
const codeContent = require("../../mail-verify");
const redis = require("../../redis");
const { NotFound } = require("../../lib/error-handling");

exports.Mailer = class Mailer {
  constructor(options) {
    this.options = options || {};
  }
  async create(data, params) {
    const { email } = data;
    const code = Math.random()
      .toString()
      .slice(2, 2 + 6); // 6 is length of verify code

    try {
      const transport = nodemailer.createTransport({
        service: "Zoho",
        host: "smtp.zoho.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.ZOHO_EMAIL,
          pass: process.env.ZOHO_PASSWORD,
        },
      });
      const codeVerifyContent = codeContent(code, email);

      await transport.sendMail({
        from: `Mooly <${process.env.ZOHO_EMAIL_FROM}>`,
        to: email,
        subject: "Verification Email",
        html: codeVerifyContent,
      });
      return await redis.set(`code-${email}`, code, "EX", 60 * 10);
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  async find(params) {
    const { email, verifyCode } = params.query;
    const code = await redis.get(`code-${email}`);
    if (code === verifyCode) {
      return "OK";
    }
    return new NotFound("Verify code is not founded", "not-found");
  }
};
