import { logout } from "../model/user/user-model";
import { mainPageView } from "../view/main-page-view";
import { loginView } from "../view/login-view";
import { query } from "../helper/query";

export const initializeLogoutFunctionality = function () {
  const logoutBtn = query(".logout-btn");
  logoutBtn.addEventListener("click", handleLogout);
};

const handleLogout = function () {
  logout().then((resp) => {
    if (resp.status === 200) {
      mainPageView.displayMain(false);
      loginView.displayLoginCassette(true);
      loginView.clearLoginFields();
    }
  });
};
