import { loginCache } from "./LoginCache";
import { API_ADDRESS, API_PORT } from "../constants/ApiAddress";
import { CSRF_HEADER } from "../constants/HeadersConstants";
import { myHeaders } from "./MyHeaders";

let csrfCookie;

export const getCsrf = async function () {
  csrfCookie = extractCsrfFromCookies();
  if (csrfCookie === undefined) {
    await fetchCsrf();
  }
  myHeaders.set(CSRF_HEADER, csrfCookie);
};

const extractCsrfFromCookies = function () {
  if (document.cookie.length > 0) {
    const cookiesArr = document.cookie.split(";");
    return cookiesArr
      .filter((val) => {
        return val.match(/XSRF.+/);
      })[0]
      .slice(11);
  }
};

const fetchCsrf = async function () {
  try {
    await fetch(`http://${API_ADDRESS}:${API_PORT}/api/v1/csrf`, {
      method: "GET",
      mode: "cors",
      credentials: "include",
      headers: { Authorization: loginCache.getJwt() },
    });
    csrfCookie = extractCsrfFromCookies();
    myHeaders.set(CSRF_HEADER, csrfCookie);
  } catch (error) {}
};
