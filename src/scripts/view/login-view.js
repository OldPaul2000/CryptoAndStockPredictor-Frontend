import { query } from "../helper/query";

class LoginView {
  #usernameWarn = query(".username-input-warn");
  #username = query(".username");
  #passwordWarn = query(".password-input-warn");
  #password = query(".password");
  #loginBtn = query(".login-btn");

  setUsernameWarn(warn) {
    this.#usernameWarn.textContent = warn;
  }

  setPasswordWarn(warn) {
    this.#passwordWarn.textContent = warn;
  }

  usernameIsEmpty() {
    return this.#username.lenght === 0;
  }

  passwordIsEmpty() {
    return this.#password.lenght === 0;
  }

  handleLogin(listener) {
    this.#loginBtn.addEventListener("click", listener);
    this.#loginBtn.addEventListener("keydown", listener);
  }
}

export const loginView = new LoginView();
