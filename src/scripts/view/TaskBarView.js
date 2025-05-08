import { query } from "../helper/Query";
import { mainPageView } from "./MainPageView";

class TaskBarView {
  #taskBar = query(".task-bar");
  #icons = [];
  #lastIconIndex = 0;
  #initialMouseX;
  #initialLeft = 10;
  #ICON_WIDTH = 140;
  #SPACE_BETWEEN_ICONS = 5;
  #X_OFFSET = this.#ICON_WIDTH + this.#SPACE_BETWEEN_ICONS;
  #slideUpperLimit = visualViewport.width - this.#ICON_WIDTH - 10;

  getLastIconIndex() {
    return this.#lastIconIndex;
  }

  addIcon(iconName, iconUrl) {
    const icon = document.createElement("div");
    icon.style.left = this.#initialLeft + "px";
    icon.style.width = this.#ICON_WIDTH + "px";
    this.#icons.push(icon);
    this.#initialLeft += this.#X_OFFSET;
    icon.classList.add("window-bar-icon");
    icon.dataset.index = this.#lastIconIndex;
    icon.dataset.name = iconName.replace(/\s+/g, "-");
    icon.classList.add("tl");
    icon.insertAdjacentElement("afterbegin", this.#createIconImage(iconUrl));
    icon.insertAdjacentElement("beforeend", this.#createIconText(iconName));
    this.#taskBar.insertAdjacentElement("beforeend", icon);
    this.#addIconHandlers(icon);
    this.#lastIconIndex++;

    return icon;
  }

  #createIconImage(iconUrl) {
    const imageElement = document.createElement("img");
    imageElement.style.height = "1.6rem";
    imageElement.style.width = "1.6rem";
    imageElement.src = iconUrl;
    imageElement.draggable = false;
    return imageElement;
  }

  #createIconText(text) {
    const paragraph = document.createElement("p");
    paragraph.textContent = text;
    return paragraph;
  }

  removeIconByName(name) {
    const iconToRemove = Array.from(
      this.#taskBar.querySelectorAll(`[data-name=${name}]`)
    )[0];
    for (let i = 0; i < this.#icons.length; i++) {
      const currIcon = this.#icons[i];
      if (currIcon.dataset.name === name) {
        this.removeIcon(i);
      }
    }
  }

  removeIcon(index) {
    if (this.#icons.length > 0) {
      const icon = this.#icons[index];
      if (icon) {
        this.#taskBar.removeChild(icon);
        this.#removeAndResetNumbers(index, icon);
      }
    }
  }

  #removeAndResetNumbers = function (index, elementToRemove) {
    let i = 0;
    this.#icons = this.#icons
      .filter((icon) => {
        const iconIndex = Number.parseInt(icon.dataset.index);
        const iconToRemoveIndex = Number.parseInt(
          elementToRemove.dataset.index
        );
        return iconIndex !== iconToRemoveIndex;
      })
      .map((element) => {
        element.dataset.index = i;
        if (i >= index) {
          const currLeft = Number.parseInt(getComputedStyle(element).left);
          element.style.left = currLeft - this.#X_OFFSET + "px";
        }
        i++;
        return element;
      });
    this.#lastIconIndex--;
    this.#initialLeft -= this.#X_OFFSET;
  };

  #iconMovingHandler = (e) => {
    this.#iconWasMoved = true;
    const x = e.clientX - this.#initialMouseX;
    if (x > 10 && x < this.#slideUpperLimit) {
      const distanceBetweenIcons = x % this.#X_OFFSET;
      const iconDistanceIndex = Number.parseInt(x / this.#X_OFFSET);
      if (
        distanceBetweenIcons <= 45 &&
        x < this.#initialLeft - this.#X_OFFSET + 45
      ) {
        this.#currentIconDistanceIndex = iconDistanceIndex;
        this.#switchIconsPlace(iconDistanceIndex);
      }
      e.currentTarget.style.left = x + "px";
    }
  };

  #currentIconDistanceIndex;
  #lastIconDistanceIndex = 0;
  #switchIconsPlace(iconDistanceIndex) {
    if (iconDistanceIndex > this.#lastIconDistanceIndex) {
      let currLeft = Number.parseInt(
        getComputedStyle(this.#icons[iconDistanceIndex]).left
      );
      this.#icons[iconDistanceIndex].style.left =
        currLeft - this.#X_OFFSET + "px";
      this.#switchIconsInArray(iconDistanceIndex, this.#lastIconDistanceIndex);
      this.#lastIconDistanceIndex = iconDistanceIndex;
    } else if (iconDistanceIndex < this.#lastIconDistanceIndex) {
      let currLeft = Number.parseInt(
        getComputedStyle(this.#icons[iconDistanceIndex]).left
      );
      this.#icons[this.#lastIconDistanceIndex - 1].style.left =
        currLeft + this.#X_OFFSET + "px";
      this.#switchIconsInArray(iconDistanceIndex, this.#lastIconDistanceIndex);
      this.#lastIconDistanceIndex = iconDistanceIndex;
    }
  }

  #switchIconsInArray(icon1Index, icon2Index) {
    const tempIcon = this.#icons[icon1Index];
    this.#icons[icon1Index] = this.#icons[icon2Index];
    this.#icons[icon2Index] = tempIcon;
  }

  #holdCurrentIconInPosition(e) {
    const place = this.#currentIconDistanceIndex * this.#X_OFFSET + 10;
    e.currentTarget.style.left = place + "px";
  }

  #rearranged = false;
  #rearrangeIcons() {
    let initialLeft = 10;
    let index = 0;
    if (!this.#rearranged) {
      this.#icons.forEach((icon) => {
        icon.style.left = initialLeft + "px";
        const window = mainPageView.getWindowByName(icon.dataset.name);
        if (window.isMinimized()) {
          window.setLeft(initialLeft);
        }
        initialLeft += this.#X_OFFSET;
        index++;
      });
      this.#rearranged = true;
    }
  }

  #relatedWindow;
  #transitionEndHandler = (e) => {
    if (e.propertyName === "opacity") {
      this.#relatedWindow.classList.remove("wm");
      this.#relatedWindow.removeEventListener(
        "transitionend",
        this.#transitionEndHandler
      );
    }
  };

  #iconWasMoved = false;
  #windowUnminimizeHandler = (e) => {
    const iconName = e.currentTarget.dataset.name;
    this.#relatedWindow = Array.from(
      document.querySelectorAll(`[data-name=${iconName}]`)
    )[0];
    const windowObject = mainPageView.getWindowByName(iconName);
    if (windowObject.isMinimized() && !this.#iconWasMoved) {
      this.#relatedWindow.classList.add("wm");
      this.#relatedWindow.classList.remove("dn");
      const timeout = setTimeout(() => {
        this.#relatedWindow.style.opacity = 1;
        this.#relatedWindow.style.top = windowObject.getLastTop() + "px";
        this.#relatedWindow.style.left = windowObject.getLastLeft() + "px";
        this.#relatedWindow.style.width = windowObject.getLastWidth() + "px";
        this.#relatedWindow.style.height = windowObject.getLastHeight() + "px";
        windowObject.setMinimized(false);
        this.#updateUnminimizedWindowZIndex();
        this.#relatedWindow.addEventListener(
          "transitionend",
          this.#transitionEndHandler
        );
        clearTimeout(timeout);
      }, 10);
    }
  };

  #updateUnminimizedWindowZIndex() {
    mainPageView.getWindows().forEach((window) => {
      if (window.getWindowName() === this.#relatedWindow.dataset.name) {
        window.getWindowElement().style.zIndex = 1;
      } else {
        window.getWindowElement().style.zIndex = 0;
      }
    });
  }

  #addIconHandlers(icon) {
    icon.addEventListener("mousedown", (e) => {
      this.#rearranged = false;
      this.#iconWasMoved = false;
      this.#initialMouseX = Math.abs(
        e.clientX - Number.parseInt(getComputedStyle(e.currentTarget).left)
      );
      this.#lastIconDistanceIndex = Number.parseInt(
        Number.parseInt(getComputedStyle(e.currentTarget).left) / this.#X_OFFSET
      );
      e.currentTarget.classList.remove("tl");
      icon.style.zIndex = 1;
      icon.addEventListener("mousemove", this.#iconMovingHandler);
    });
    icon.addEventListener("mouseup", (e) => {
      this.#rearranged = false;
      this.#holdCurrentIconInPosition(e);
      icon.style.zIndex = 0;
      e.currentTarget.classList.add("tl");
      icon.removeEventListener("mousemove", this.#iconMovingHandler);
      this.#rearrangeIcons();
    });
    icon.addEventListener("mouseout", (e) => {
      this.#iconWasMoved = false;
      icon.style.zIndex = 0;
      e.currentTarget.classList.add("tl");
      icon.removeEventListener("mousemove", this.#iconMovingHandler);
      this.#rearrangeIcons();
    });
    icon.addEventListener("click", this.#windowUnminimizeHandler);
  }

  initializeViewportSizeListener() {
    visualViewport.addEventListener("resize", () => {
      this.#slideUpperLimit = visualViewport.width - this.#ICON_WIDTH - 10;
    });
  }

  getTaskBar() {
    return this.#taskBar;
  }

  getIconWidth() {
    return this.#ICON_WIDTH;
  }

  clearData() {
    this.#icons.forEach((icon) => {
      this.#taskBar.removeChild(icon);
    });
    this.#icons = [];
    this.#lastIconIndex = 0;
    this.#initialMouseX = null;
    this.#initialLeft = 10;
    this.#ICON_WIDTH = 140;
    this.#SPACE_BETWEEN_ICONS = 5;
    this.#X_OFFSET = this.#ICON_WIDTH + this.#SPACE_BETWEEN_ICONS;
    this.#slideUpperLimit = visualViewport.width - this.#ICON_WIDTH - 10;
    this.#taskBar = query(".task-bar");
  }
}

export const taskBarView = new TaskBarView();
