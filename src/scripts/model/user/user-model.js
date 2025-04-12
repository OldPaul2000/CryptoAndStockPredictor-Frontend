import { loginCache } from "../../cache/login-cache.js";
import { API_ADDRESS, API_PORT } from "../../constants/api-address.js";
import { myHeaders } from "../../cache/my-headers.js";
import {
  CSRF_HEADER,
  AUTHORIZATION_HEADER,
} from "../../constants/headers-constants.js";
import { getCsrf } from "../../cache/csrf-cache.js";

export const login = async function (credentials) {
  myHeaders.set("Content-Type", "application/json");
  try {
    const response = await fetch(
      `http://${API_ADDRESS}:${API_PORT}/api/v1/users/login`,
      {
        method: "POST",
        mode: "cors",
        credentials: "include",
        headers: myHeaders,
        body: JSON.stringify(credentials),
      }
    );
    const jsonResponse = await response.json();
    if (response.status === 200) {
      loginCache.setUserId(jsonResponse.userId);
      loginCache.setUsername(jsonResponse.username);
      loginCache.setJwt(jsonResponse.jwt);
      loginCache.setRoles(jsonResponse.roles);

      myHeaders.set(CSRF_HEADER, getCsrf());
      myHeaders.set(AUTHORIZATION_HEADER, loginCache.getJwt());
      return response;
    }
    return jsonResponse;
  } catch (error) {}
};

export const logout = async function () {
  try {
    const response = await fetch(
      `http://${API_ADDRESS}:${API_PORT}/api/v1/users/logout`,
      {
        method: "POST",
        mode: "cors",
        credentials: "include",
        headers: myHeaders,
      }
    );
    if (!response.ok) {
      return await response.json();
    }
    return response;
  } catch (error) {}
};
