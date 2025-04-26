import { logout } from "../model/user/UserModel";
import { mainPageView } from "../view/MainPageView";
import { loginView } from "../view/LoginView";
import { query } from "../helper/Query";
import { loginCache } from "../cache/LoginCache";
import { myHeaders, clearHeaders } from "../cache/MyHeaders";

export const initializeLogoutFunctionality = function () {
  const logoutBtn = query(".logout-btn");
  logoutBtn.addEventListener("click", handleLogout);
};

const handleLogout = async function () {
  const resp = await logout();
  if (resp.status === 200) {
    mainPageView.displayMain(false);
    loginView.displayLogin(true);
    // loginView.clearLoginFields();
    loginCache.clearData();
    clearHeaders();
  }
};
