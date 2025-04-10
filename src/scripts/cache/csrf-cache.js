import { loginCache } from "./login-cache";
import { API_ADDRESS, API_PORT } from "../constants/api-address";
import { myHeaders } from "./my-headers";

export const getCsrf = function () {
  const cookies = document.cookie;
  if (cookies.length > 0) {
    const cookiesArr = cookies.split(";");
    return cookiesArr
      .filter((val) => {
        return val.match(/XSRF.+/);
      })[0]
      .slice(11);
  }
};

export const fetchCsrf = async function () {
  try {
    const response = await fetch(
      `http://${API_ADDRESS}:${API_PORT}/api/v1/csrf`,
      {
        method: "GET",
        mode: "cors",
        credentials: "include",
        headers: { Authorization: loginCache.getJwt() },
      }
    );
    return await response.json();
  } catch (error) {}
};
