import { query } from "../helper/query";

class MainPageView {
  #main = query("main");

  displayMain(display) {
    if (!display) {
      this.#main.classList.add("dn");
      this.#main.style.zIndex = 1;
    } else {
      this.#main.classList.remove("dn");
      this.#main.style.zIndex = 3;
    }
  }
}

export const mainPageView = new MainPageView();
