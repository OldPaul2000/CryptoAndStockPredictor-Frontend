class LoginCache {
  #userId;
  #username;
  #jwt;
  #roles;

  setUserId(id) {
    this.#userId = id;
  }

  getUserId() {
    return this.#userId;
  }

  setUsername(username) {
    this.#username = username;
  }

  getUsername() {
    return this.#username;
  }

  setJwt(jwt) {
    this.#jwt = jwt;
  }

  getJwt() {
    return this.#jwt;
  }

  setRoles(roles) {
    this.#roles = roles;
  }

  getRoles() {
    return this.#roles;
  }

  getLoginSessionInfo() {
    return {
      userId: this.#userId,
      username: this.#username,
      jwt: this.#jwt,
      roles: this.#roles,
    };
  }

  clearData() {
    this.#userId = null;
    this.#username = null;
    this.#jwt = null;
    this.#roles = null;
  }
}

export const loginCache = new LoginCache();
