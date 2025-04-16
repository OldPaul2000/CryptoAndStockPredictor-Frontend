import { query } from "../helper/Query";

class MainPageView {
  #main = query("main");

  #transitionHandler = (e) => {
    const tagName = e.target.tagName;
    if (e.propertyName === "opacity" && tagName === "MAIN") {
      this.#main.classList.add("dn");
      this.#main.removeEventListener("transitionend", this.#transitionHandler);
    }
  };

  displayMain(display) {
    if (!display) {
      this.#main.addEventListener("transitionend", this.#transitionHandler);
      this.#main.classList.add("op-0");
      this.#main.style.zIndex = 1;
    } else {
      this.#main.classList.remove("dn");
      const timeout = setTimeout(() => {
        this.#main.classList.remove("op-0");
        clearTimeout(timeout);
      }, 100);
      this.#main.style.zIndex = 3;
    }
  }
}

export const mainPageView = new MainPageView();
