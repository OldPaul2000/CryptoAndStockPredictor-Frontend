import { mainPageView } from "../view/MainPageView";

class WindowMovingHandler {
  #initialWindowX;
  #initialWindowY;
  #currentWindow;

  #moveHandler = (e) => {
    if (this.#currentWindow) {
      this.#currentWindow.style.left = e.clientX - this.#initialWindowX + "px";
      this.#currentWindow.style.top = e.clientY - this.#initialWindowY + "px";
    }
  };

  #setInitialCursorCoords(event, window) {
    this.#initialWindowX = event.clientX - Number.parseInt(window.style.left);
    this.#initialWindowY = event.clientY - Number.parseInt(window.style.top);
  }

  #getCurrentWindow(e) {
    const targetName = e.target.classList[0];
    if (targetName === "window-bar") {
      this.#currentWindow = e.target.parentNode;
    }
    if (targetName === "window-title" || targetName === "window-icon") {
      this.#currentWindow = e.target.parentNode.parentNode;
    }
    if (this.#currentWindow?.classList[0] === "window-container") {
      this.#setInitialCursorCoords(e, this.#currentWindow);
    }
  }

  initializeWindowsMoveHandler = function () {
    document.addEventListener("mousedown", (e) => {
      document.body.style.userSelect = "none";
      if (
        e.target.classList[0] === "window-bar" ||
        e.target.classList[0] === "window-title" ||
        e.target.classList[0] === "window-icon"
      ) {
        this.#getCurrentWindow(e);
        const targetParent = e.target.parentNode.parentNode;
        if (
          e.target.classList[0] !== "content-container" &&
          targetParent.classList[0] !== "window-btns-container"
        ) {
          document.addEventListener("mousemove", this.#moveHandler);
        }
      }
    });
    document.addEventListener("mouseup", (e) => {
      document.body.style.userSelect = "auto";
      const windowName = this.#currentWindow?.dataset.name;
      if (windowName) {
        const currWindow = mainPageView.getWindowByName(windowName);
        if (currWindow && !currWindow.isMinimized()) {
          currWindow.setLastLeft(
            Number.parseInt(this.#currentWindow.style.left)
          );
          currWindow.setLastTop(Number.parseInt(this.#currentWindow.style.top));
        }
      }
      document.removeEventListener("mousemove", this.#moveHandler);
    });
  };
}

export const windowMovingHandler = new WindowMovingHandler();
