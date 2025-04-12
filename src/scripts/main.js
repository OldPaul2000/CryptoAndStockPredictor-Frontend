import { initializeLoginFunctionality } from "./controller/login-controller";
import { logout } from "./model/user/user-model";
import { fetchCsrf } from "./cache/csrf-cache";
import { query } from "./helper/query";
import { initializeLogoutFunctionality } from "./controller/logout-controller";

initializeLoginFunctionality();
initializeLogoutFunctionality();
