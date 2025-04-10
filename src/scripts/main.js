import * as userModel from "./model/user/user-model.js";
import { loginCache } from "./cache/login-cache.js";
import { getCsrf, fetchCsrf } from "./cache/csrf-cache.js";
import { loginView } from "./view/login-view.js";

// userModel.login({ username: "john", password: "john1234" }).then((resp) => {
//   console.log(loginCache.getLoginSessionInfo());
// });

// setTimeout(() => {
//   fetchCsrf().then((resp) => {
//     console.log(resp);
//   });
// }, 3000);

loginView.setUsernameWarn("");
loginView.setPasswordWarn("");
