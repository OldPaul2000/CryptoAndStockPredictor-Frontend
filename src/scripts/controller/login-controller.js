import { login } from "../model/user/user-model";
import { loginView } from "../view/login-view";

console.log("Hello");
initLoginBtnListener();

const initLoginBtnListener = function () {
  console.log("Hello");
  loginView.handleLogin(loginBtnListener);
};

const loginBtnListener = function () {
  console.log("Hello");
};
