import { query } from "../helper/Query";
import { toolsPanelView } from "./ToolsPanelView";

class DataUpdateView {
  #LOADING_ICON = new URL("../../assets/icons/loading.png", import.meta.url);

  #dataUpdateView;
  #newDataContainer;
  #dataColumnNames;
  #newDataElements;
  #confirmButtons;
  #confirmBtn;
  #cancelBtn;
  #availableFilesList;
  #loadNewDataBtn;

  addNewDataElement(currencyObject) {
    const dataElement = `<div class=\"data-element\">
          <p class=\"id\">${currencyObject.id}.</p>
          <p class=\"date\">${currencyObject.date}</p>
          <p class=\"close\">${currencyObject.close}</p>
          <p class=\"volume\">${currencyObject.volume}</p>
          <p class=\"open\">${currencyObject.open}</p>
          <p class=\"high\">${currencyObject.high}</p
          <p class=\"low\">${currencyObject.low}</p>
        </div>`;

    this.#newDataElements.insertAdjacentHTML("afterbegin", dataElement);
  }

  getContent() {
    return `
      <div class=\"data-update-view\">
       <div class=\"confirm-buttons\">
            <button class=\"confirm-btn\">Confirm</button>
            <button class=\"cancel-btn\">Cancel</button>
            <select class=\"available-files\"></select>
            <button class=\"load-data-btn\">Load data</button>
          </div>
          <div class=\"new-data-container\">
            <div class=\"data-column-names\">
             <p class=\"id-column-name\">Id</p>
             <p class=\"date-column-name\">Date</p>
             <p class=\"close-column-name\">Close</p>
             <p class=\"volume-column-name\">Volume</p>
             <p class=\"open-column-name\">Open</p>
             <p class=\"high-column-name\">High</p>
             <p class=\"low-column-name\">Low</p>
            </div>
            <div class=\"new-data-elements\"></div>
          </div>
      </div>
    `;
  }

  loadAvailableFiles(files) {
    if (files) {
      this.#availableFilesList.innerHTML = "";
      files.forEach((fileName) => {
        this.#availableFilesList.insertAdjacentHTML(
          "afterbegin",
          `<option value=\"${fileName}\">${fileName}</option>`
        );
      });
    }
  }

  displayLoading(display) {
    if (display) {
      const loadingElement = `<div class=\"loading-element\">
          <img class=\"loading-icon\" src=${this.#LOADING_ICON}>
       </div>`;
      this.#newDataElements.insertAdjacentHTML("afterbegin", loadingElement);
    } else {
      const loadingElement =
        this.#newDataElements.querySelector(".loading-element");
      this.#newDataElements.removeChild(loadingElement);
    }
  }

  setMessage(message) {
    const messageHtml = `<p class=\"update-message\">${message}</p>`;
    this.#newDataElements.insertAdjacentHTML("afterbegin", messageHtml);
    const timeout = setTimeout(() => {
      const message = this.#newDataElements.querySelector(".update-message");
      this.#newDataElements.removeChild(message);
      clearTimeout(timeout);
    }, 4000);
  }

  clearContent() {
    this.#newDataElements.innerHTML = "";
    this.#availableFilesList.innerHTML = "";
  }

  removeNewDataElements() {
    this.#newDataElements.innerHTML = "";
  }

  setConfirmBtnListener(listener) {
    this.#confirmBtn.addEventListener("click", (e) => {
      listener();
    });
  }

  setCancelBtnListener(listener) {
    this.#cancelBtn.addEventListener("click", (e) => {
      listener();
    });
  }

  setFilesListListener(listener) {
    this.#availableFilesList.addEventListener("mousedown", (e) => {
      listener(e);
    });
  }

  setLoadDataBtnListener(listener) {
    this.#loadNewDataBtn.addEventListener("click", (e) => {
      listener();
    });
  }

  getSelectedFile() {
    return this.#availableFilesList.value;
  }

  initializeDataUpdateView() {
    this.#dataUpdateView = query(".data-update-view");
    this.#newDataContainer = this.#dataUpdateView.querySelector(
      ".new-data-container"
    );
    this.#newDataElements =
      this.#newDataContainer.querySelector(".new-data-elements");
    this.#dataColumnNames =
      this.#newDataContainer.querySelector(".data-column-names");
    this.#confirmButtons =
      this.#dataUpdateView.querySelector(".confirm-buttons");
    this.#confirmBtn = this.#confirmButtons.querySelector(".confirm-btn");
    this.#cancelBtn = this.#confirmButtons.querySelector(".cancel-btn");
    this.#availableFilesList =
      this.#confirmButtons.querySelector(".available-files");
    this.#loadNewDataBtn = this.#confirmButtons.querySelector(".load-data-btn");
  }
}

export const dataUpdateView = new DataUpdateView();
