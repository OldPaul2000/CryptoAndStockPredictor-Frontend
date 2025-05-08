import { logout } from "../model/user/UserModel";
import { mainPageView } from "../view/MainPageView";
import { taskBarView } from "../view/TaskBarView";
import { windowMovingHandler } from "../helper/WindowMovingLogic";
import { windowResizeHandler } from "../helper/WindowResizeLogic";
import { loginView } from "../view/LoginView";
import { query } from "../helper/Query";
import { loginCache } from "../cache/LoginCache";
import { clearHeaders } from "../cache/MyHeaders";

export const initializeLogoutController = function () {
  const logoutBtn = query(".logout-btn");
  logoutBtn.addEventListener("click", handleLogout);
};

const handleLogout = async function () {
  const resp = await logout();
  if (resp.status === 200) {
    mainPageView.clearData();
    taskBarView.clearData();
    windowMovingHandler.clearData();
    windowResizeHandler.clearData();
    mainPageView.displayMain(false);
    loginView.displayLogin(true);
    // loginView.clearLoginFields();
    loginCache.clearData();
    clearHeaders();
  }
};
