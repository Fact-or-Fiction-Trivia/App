import axios from "axios";
export default axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? process.env.REACT_APP_PRODUCTION_BASE_URL
      : "http://localhost:8080",
  withCredentials: true,
});
