/* eslint-disable linebreak-style */
const codeContent = (code, email) => {
  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif">
      <div style="text-align: center">
        <img
          style="width: 10%; text-align: center"
          src="https://res.cloudinary.com/abeesdev/image/upload/v1656353470/mail/yxtl5wmg5tgxd4jbm3du.png"
        />
      </div>

      <h4
        style="
      font-size: 28px;
      font-weight: 500;
      margin: 12px 0;
      text-align: center;
    "
      >
        Xin chào ${email}
      </h4>
      <p style="font-size: 18px; color: #757575; margin: 0; text-align: center">
        Bạn vừa đăng kí tài khoản trên Edutech, <br />
        vui lòng nhập mã để xác thực
      </p>
      <div style="display: flex; justify-content: center;">
        <div
          style="
        width: 25%;
        border-top: 1px solid #e0e0e0;
        margin: 0 auto;
        text-align: center;
        margin-top: 12px;
      "
        ></div>
      </div>

      <p style="font-size: 18px; color: #424242; text-align: center">
        Mã xác thực
      </p>
      <h3
        style="
      font-size: 18px;
      color: #424242;
      margin-top: 0;
      text-align: center;
    "
      >
      ${code}
      </h3>
      <div style="text-align: center">
        <div
          style="
        width: 25%;
        border-top: 1px solid #e0e0e0;
        margin: 0 auto;
        text-align: center;
        margin-top: 12px;
      "
        ></div>
      </div>
      <p style="color: #757575; text-align: center; margin: 16px 32px">
        Bạn không thể đăng nhập Edutech khi chưa xác nhận ở email này
      </p>
    </div>
  `;
};

module.exports = codeContent;
