module.exports = function getBase(
  production = process.env.NODE_ENV === "production"
) {
  let url;
  if (production) {
    url = process.env.PRODUCTION_BASE_URL;
  } else {
    url = "http://localhost:8080/";
  }
  return url;
};
