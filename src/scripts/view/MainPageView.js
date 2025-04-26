import { query } from "../helper/Query";

class MainPageView {
  #main = query("main");
  #windows = [];

  getWindowByIndex(index) {
    return this.#windows[index];
  }

  getWindowByName(name) {
    return this.#windows.filter((currWindow) => {
      return currWindow.getWindowName() === name;
    })[0];
  }

  getWindows() {
    return this.#windows;
  }

  addWindow(window) {
    this.#windows.push(window);
  }

  removeWindow(window) {
    this.#windows.forEach((currWindow) => {
      if (window.getWindowName() === currWindow.getWindowName()) {
        const windowToRemove = Array.from(
          document.querySelectorAll(`[data-name=${window.getWindowName()}]`)
        )[0];
        windowToRemove.remove();
      }
    });
    this.#windows = this.#windows.filter((currWindow) => {
      return currWindow.getWindowName() !== window.getWindowName();
    });
  }

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

  getMainPage() {
    return this.#main;
  }
}

export const mainPageView = new MainPageView();
