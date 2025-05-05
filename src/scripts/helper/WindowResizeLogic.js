import { mainPageView } from "../view/MainPageView";

class WindowResizeHandler {
  #initialWindowX;
  #initialWindowY;
  #initialWindowWidth;
  #currentWindow;
  #DONT_KNOW_WHAT_OFFSET = 146;

  #mousePressed = false;
  #resizeHandler = (e) => {
    if (
      e.target.classList[0] === "content-container" ||
      e.target.classList[0] === "chart-content" ||
      (e.target.parentNode?.classList &&
        e.target.parentNode.classList[0] === "content-container") ||
      e.target.classList[0] === "main-page"
    ) {
      const resizeDirection = this.#currentWindow.dataset.resizeDirection;
      if (resizeDirection === "cr") {
        this.#currentWindow.style.width =
          e.screenX - Number.parseInt(this.#currentWindow.style.left) + "px";
        this.#currentWindow.style.height =
          e.screenY -
          Number.parseInt(this.#currentWindow.style.top) -
          this.#DONT_KNOW_WHAT_OFFSET +
          "px";
      }
      if (resizeDirection === "hr") {
        this.#currentWindow.style.width =
          e.screenX - Number.parseInt(this.#currentWindow.style.left) + "px";
      }
      if (resizeDirection === "v") {
        this.#currentWindow.style.height =
          e.screenY -
          Number.parseInt(this.#currentWindow.style.top) -
          this.#DONT_KNOW_WHAT_OFFSET +
          "px";
      }
      if (resizeDirection === "hl") {
        this.#currentWindow.style.left = e.screenX + "px";
        this.#currentWindow.style.width =
          this.#initialWindowWidth - (e.screenX - this.#initialWindowX) + "px";
      }
      if (resizeDirection === "cl") {
        this.#currentWindow.style.left = e.screenX + "px";
        this.#currentWindow.style.width =
          this.#initialWindowWidth - (e.screenX - this.#initialWindowX) + "px";
        this.#currentWindow.style.height =
          e.screenY -
          Number.parseInt(this.#currentWindow.style.top) -
          this.#DONT_KNOW_WHAT_OFFSET +
          "px";
      }
    }
  };

  #getCurrentWindow(e) {
    if (e.target.parentNode.classList[0] === "window-container") {
      this.#currentWindow = e.target.parentNode;
    } else if (
      e.target.parentNode.parentNode.classList[0] === "window-container"
    ) {
      this.#currentWindow = e.target.parentNode.parentNode;
    }
  }

  #setInitialCursorCoords(event) {
    this.#initialWindowX = Number.parseInt(this.#currentWindow.style.left);
    this.#initialWindowY = Number.parseInt(this.#currentWindow.style.top);
  }

  mouseIsPressed() {
    return this.#mousePressed;
  }

  initializeWindowsResizeHandler = function () {
    document.addEventListener("mousedown", (e) => {
      this.#mousePressed = true;
      if (
        e.target.classList[0] === "content-container" ||
        e.target.parentNode.classList[0] === "content-container"
      ) {
        this.#getCurrentWindow(e);
        if (
          this.#currentWindow?.classList &&
          this.#currentWindow.classList[0] === "window-container" &&
          this.#currentWindow.dataset.resize === "true"
        ) {
          this.#setInitialCursorCoords(e);
          document.body.style.userSelect = "none";
          this.#initialWindowWidth = Number.parseInt(
            this.#currentWindow.style.width
          );
          document.addEventListener("mousemove", this.#resizeHandler);
        }
      }
    });
    document.addEventListener("mouseup", (e) => {
      this.#mousePressed = false;
      const windowName = this.#currentWindow?.dataset.name;
      if (windowName) {
        const currWindow = mainPageView.getWindowByName(windowName);
        if (currWindow && !currWindow.isMinimized()) {
          currWindow.setLastWidth(
            Number.parseInt(this.#currentWindow.style.width)
          );
          currWindow.setLastHeight(
            Number.parseInt(this.#currentWindow.style.height)
          );
        }
      }
      document.body.style.userSelect = "auto";
      document.removeEventListener("mousemove", this.#resizeHandler);
    });
  };
}

export const windowResizeHandler = new WindowResizeHandler();
