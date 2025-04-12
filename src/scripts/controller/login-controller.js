import { login } from "../model/user/user-model";
import { loginView } from "../view/login-view";
import { mainPageView } from "../view/main-page-view";

export const initializeLoginFunctionality = function () {
  loginView.handleLogin(loginHandler);
};

const loginHandler = function (e) {
  if (e.key === "enter" || e.type === "click") {
    if (!loginView.usernameIsEmpty() && !loginView.passwordIsEmpty()) {
      login({
        username: loginView.getUsername(),
        password: loginView.getPassword(),
      }).then((resp) => {
        if (resp.status === 200) {
          console.log("Login successfully");
          loginView.displayLoginCassette(false);
          mainPageView.displayMain(true);
        }
        if (resp.status && resp.status === 404) {
          loginView.setUsernameWarn(resp.message);
        }
        if (resp.status && resp.status === 401) {
          loginView.setPasswordWarn(resp.message);
        }
      });
    }
  }
};
