import { query } from "../helper/Query";

class LoginView {
  #backgroundImage = query(".image");
  #loginContainer = query(".login-container");
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
    return this.#username.value.length === 0;
  }

  passwordIsEmpty() {
    return this.#password.value.length === 0;
  }

  getUsername() {
    return this.#username.value;
  }

  getPassword() {
    return this.#password.value;
  }

  #transitionHandler = (e) => {
    const elementName = e.target.classList[0];
    const propertyName = e.propertyName;
    if (elementName === "login-container" && propertyName === "opacity") {
      this.#loginContainer.classList.add("dn");
      this.#loginContainer.removeEventListener(
        "transitionend",
        this.#transitionHandler
      );
    }
  };

  displayLogin(display) {
    if (!display) {
      this.#loginContainer.addEventListener(
        "transitionend",
        this.#transitionHandler
      );
      this.#loginContainer.classList.add("op-0");
      this.#backgroundImage.classList.add("bi-f");
    } else {
      this.#loginContainer.classList.remove("dn");
      const timeout = setTimeout(() => {
        this.#loginContainer.classList.remove("op-0");
        clearTimeout(timeout);
      }, 100);
      this.#backgroundImage.classList.remove("bi-f");
    }
  }

  clearLoginFields() {
    this.#username.value = "";
    this.#password.value = "";
  }

  handleEmptyInputs() {
    if (this.usernameIsEmpty()) {
      this.setUsernameWarn("Empty field");
    } else {
      this.setUsernameWarn("");
    }

    if (this.passwordIsEmpty()) {
      this.#passwordWarn.textContent = "Empty field";
    } else {
      this.setPasswordWarn("");
    }
  }

  handleLogin(listener) {
    this.#loginBtn.addEventListener("click", (e) => {
      this.handleEmptyInputs();
      listener(e);
    });
    this.#loginBtn.addEventListener("keydown", (e) => {
      this.handleEmptyInputs();
      listener(e);
    });
  }
}

export const loginView = new LoginView();
