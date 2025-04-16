import { login } from "../model/user/UserModel";
import { loginView } from "../view/LoginView";
import { mainPageView } from "../view/MainPageView";

export const initializeLoginFunctionality = function () {
  loginView.handleLogin(loginHandler);
};

const loginHandler = async function (e) {
  if (e.key === "enter" || e.type === "click") {
    if (!loginView.usernameIsEmpty() && !loginView.passwordIsEmpty()) {
      const resp = await login({
        username: loginView.getUsername(),
        password: loginView.getPassword(),
      });

      if (resp.status === 200) {
        loginView.displayLogin(false);
        mainPageView.displayMain(true);
      }
      if (resp.status && resp.status === 404) {
        loginView.setUsernameWarn(resp.message);
      }
      if (resp.status && resp.status === 401) {
        loginView.setPasswordWarn(resp.message);
      }
    }
  }
};
