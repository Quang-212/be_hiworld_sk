module.exports = function getCookie(key, params) {
  const cookieInfo = params.headers?.cookie;
  const cookie =
    cookieInfo &&
    cookieInfo.split(";").reduce((cookieObj, cookie) => {
      const singleCookieSplit = cookie.split("=");
      cookieObj[singleCookieSplit[0].trim()] = singleCookieSplit[1].trim();
      return cookieObj;
    }, {});
  return cookie?.[key];
};
