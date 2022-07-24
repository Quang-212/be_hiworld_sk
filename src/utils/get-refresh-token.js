const getRefreshToken = (params) => {
  const cookieInfo = params.headers?.cookie;
  const cookieTokenKey = "refreshToken=";
  return (
    cookieInfo?.substring(
      cookieInfo?.indexOf(cookieTokenKey) + cookieTokenKey?.length
    ) || ""
  );
};
module.exports = getRefreshToken;
