import { query } from "../helper/Query";

class ToolsPanelView {
  #mainPanel = query(".tools-panel");
  #hidePanelBtn = query(".hide-panel-btn");
  #hidePanelBtnImage = query(".hide-panel-btn img");

  hidePanelHandler = () => {
    this.#mainPanel.classList.toggle("hp");
    this.#hidePanelBtnImage.classList.toggle("rhba");
  };

  setHidePanelHandler() {
    this.#hidePanelBtn.addEventListener("click", this.hidePanelHandler);
  }

  initializeToolsPanelView() {
    this.setHidePanelHandler();
  }
}

export const toolsPanelView = new ToolsPanelView();
