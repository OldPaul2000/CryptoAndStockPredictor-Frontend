import { query } from "../helper/Query";
import { mainPageView } from "./MainPageView";
import { taskBarView } from "./TaskBarView";
import { windowResizeHandler } from "../helper/WindowResizeLogic";

export class WindowView {
  #MINIMIZE_ICON = new URL("../../assets/icons/minimize.png", import.meta.url);
  #MAXIMIZE_ICON = new URL("../../assets/icons/maximize.png", import.meta.url);
  #CLOSE_ICON = new URL("../../assets/icons/close.png", import.meta.url);

  #mainPage = query(".main-page");

  #minimizeBtn;
  #maximizeBtn;
  #closeBtn;

  #window;
  #windowTitle;
  #content;
  #icon;
  #taskBarIcon;
  #RESIZE_CURSOR_DISPLAY_RANGE_FACTOR = 10;

  #lastLeft;
  #lastTop;
  #lastWidth;
  #lastHeight;
  #minimized = false;

  constructor(windowTitle, content, icon) {
    this.#windowTitle = windowTitle;
    this.#content = content;
    this.#icon = icon;
  }

  #getWindowStructure() {
    const windowStructure = `<div class=\"window-container\">
      <div class=\"window-bar\">
        <img class=\"window-icon\" draggable=false src=${this.#icon}>
        <p class=\"window-title\" >${this.#windowTitle}</p>
        <div class=\"window-btns-container\">
          <button class=\"minimize-btn\">
            <img class=\"minimize-icon\" src=${this.#MINIMIZE_ICON}>
          </button>
          <button class=\"maximize-btn\">
            <img class=\"maximize-icon\" src=${this.#MAXIMIZE_ICON}>
          </button>
          <button class=\"close-btn\">
            <img class=\"close-icon\" src=${this.#CLOSE_ICON}>
          </button>
        </div>
      </div>
      <div class=\"content-container\">${this.#content}</div>
    </div>`;

    return windowStructure;
  }

  getWindowElement() {
    return this.#window;
  }

  setLeft(left) {
    this.#window.style.left = left + "px";
  }

  setLastLeft(left) {
    this.#lastLeft = left;
  }

  getLastLeft() {
    return this.#lastLeft;
  }

  setLastTop(top) {
    this.#lastTop = top;
  }

  getLastTop() {
    return this.#lastTop;
  }

  setLastWidth(width) {
    this.#lastWidth = width;
  }

  getLastWidth() {
    return this.#lastWidth;
  }

  setLastHeight(height) {
    this.#lastHeight = height;
  }

  getLastHeight() {
    return this.#lastHeight;
  }

  setMinimized(minimized) {
    this.#minimized = minimized;
  }

  isMinimized() {
    return this.#minimized;
  }

  #setInitialPosition(window) {
    const initialTop = 100;
    const initialLeft = 400;
    window.style.top = `${initialTop}px`;
    window.style.left = `${initialLeft}px`;
    this.setLastTop(initialTop);
    this.setLastLeft(initialLeft);
  }

  #calculateCursorDisplayRange(e) {
    const windowWidth = Number.parseInt(e.currentTarget.style.width);
    const windowHeight = Number.parseInt(e.currentTarget.style.height);
    if (
      e.target.classList[0] === "content-container" &&
      !windowResizeHandler.mouseIsPressed()
    ) {
      if (
        e.offsetY >= windowHeight - this.#RESIZE_CURSOR_DISPLAY_RANGE_FACTOR &&
        e.offsetX > this.#RESIZE_CURSOR_DISPLAY_RANGE_FACTOR &&
        e.offsetX < windowWidth - this.#RESIZE_CURSOR_DISPLAY_RANGE_FACTOR
      ) {
        this.#window.style.cursor = "ns-resize";
        // v -> vertical
        this.#window.dataset.resizeDirection = "v";
        this.#window.dataset.resize = true;
      } else if (
        e.offsetX >= windowWidth - this.#RESIZE_CURSOR_DISPLAY_RANGE_FACTOR &&
        e.offsetY >= windowHeight - this.#RESIZE_CURSOR_DISPLAY_RANGE_FACTOR
      ) {
        this.#window.style.cursor = "nwse-resize";
        // cr -> corner right
        this.#window.dataset.resizeDirection = "cr";
        this.#window.dataset.resize = true;
      } else if (
        e.offsetX <= windowWidth - this.#RESIZE_CURSOR_DISPLAY_RANGE_FACTOR &&
        e.offsetY >= windowHeight - this.#RESIZE_CURSOR_DISPLAY_RANGE_FACTOR
      ) {
        this.#window.style.cursor = "nesw-resize";
        // cr -> corner left
        this.#window.dataset.resizeDirection = "cl";
        this.#window.dataset.resize = true;
      } else if (
        e.offsetX <= this.#RESIZE_CURSOR_DISPLAY_RANGE_FACTOR &&
        e.offsetY < windowHeight - this.#RESIZE_CURSOR_DISPLAY_RANGE_FACTOR
      ) {
        this.#window.style.cursor = "ew-resize";
        // h -> horizontal-left
        this.#window.dataset.resizeDirection = "hl";
        this.#window.dataset.resize = true;
      } else if (
        e.offsetX >= windowWidth - this.#RESIZE_CURSOR_DISPLAY_RANGE_FACTOR &&
        e.offsetY < windowHeight - this.#RESIZE_CURSOR_DISPLAY_RANGE_FACTOR
      ) {
        this.#window.style.cursor = "ew-resize";
        // h -> horizontal-right
        this.#window.dataset.resizeDirection = "hr";
        this.#window.dataset.resize = true;
      } else {
        this.#window.style.cursor = "default";
        this.#window.dataset.resize = false;
        this.#window.resizeDirection = null;
      }
    } else {
      this.#window.style.cursor = "default";
    }
  }

  #initializeResizeCursorDisplayHandler() {
    this.#window.addEventListener("mousemove", (e) => {
      this.#calculateCursorDisplayRange(e);
    });
  }

  setTaskbarIcon(icon) {
    this.#taskBarIcon = icon;
  }

  getTaskbarIcon() {
    return this.#taskBarIcon;
  }

  getWindowName() {
    return this.#windowTitle.replace(/\s+/g, "-");
  }

  #minimizeTransitionHandler = (e) => {
    if (e.target.classList[0] === "window-container") {
      this.#window.classList.remove("wm");
      this.#window.classList.add("dn");
      this.#window.removeEventListener(
        "transitionend",
        this.#minimizeTransitionHandler
      );
    }
  };

  #BOTTOM_WINDOW_HIDE_OFFSET = 28;
  #MINIMIZE_HEIGHT = 20;
  #minimizeHandler = (e) => {
    const iconLeft = Number.parseInt(this.#taskBarIcon.style.left);
    const pageBottom = visualViewport.height;
    this.#window.style.left = iconLeft + "px";
    this.#window.style.top =
      pageBottom - this.#BOTTOM_WINDOW_HIDE_OFFSET + "px";
    this.#window.style.width = taskBarView.getIconWidth() + "px";
    this.#window.style.height = this.#MINIMIZE_HEIGHT + "px";
    this.#window.style.opacity = 0;
    this.#window.classList.add("wm");
    this.#window.addEventListener(
      "transitionend",
      this.#minimizeTransitionHandler
    );
    this.setMinimized(true);
  };

  #maximizeHandler = (e) => {};

  #closeWindowTransitionHandler = (e) => {
    if (e.propertyName === "opacity") {
      taskBarView.removeIconByName(this.getWindowName());
      mainPageView.removeWindow(this);
    }
  };

  #closeHandler = (e) => {
    this.#window.classList.add("wc");
    this.#window.style.opacity = 0;
    this.#window.addEventListener(
      "transitionend",
      this.#closeWindowTransitionHandler
    );
  };

  #initializeButtonsHandlers() {
    this.#minimizeBtn.addEventListener("click", this.#minimizeHandler);
    this.#maximizeBtn.addEventListener("click", this.#maximizeHandler);
    this.#closeBtn.addEventListener("click", this.#closeHandler);
  }

  #initializeZIndexHandler() {
    this.#window.addEventListener("mousedown", (e) => {
      this.getWindowElement().style.zIndex = 1;
      mainPageView.getWindows().forEach((window) => {
        if (window !== this) {
          window.getWindowElement().style.zIndex = 0;
        }
      });
    });
  }

  createWindow() {
    this.#mainPage.insertAdjacentHTML("afterbegin", this.#getWindowStructure());
    this.#window = query(".window-container");
    this.#minimizeBtn = query(".minimize-btn");
    this.#maximizeBtn = query(".maximize-btn");
    this.#closeBtn = query(".close-btn");
    const initialWidth = 500;
    const initialHeight = 280;
    this.#window.style.width = `${initialWidth}px`;
    this.#window.style.height = `${initialHeight}px`;
    this.setLastWidth(initialWidth);
    this.setLastHeight(initialHeight);
    this.#window.dataset.resize = false;
    this.#window.dataset.name = this.#windowTitle.replace(/\s+/g, "-");
    this.#setInitialPosition(this.#window);
    this.#initializeResizeCursorDisplayHandler();
    this.#initializeButtonsHandlers();
    this.#initializeZIndexHandler();
    mainPageView.addWindow(this);
  }
}
