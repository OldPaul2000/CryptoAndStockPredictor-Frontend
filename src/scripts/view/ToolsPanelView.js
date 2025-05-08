import { query } from "../helper/Query";
import { loginCache } from "../cache/LoginCache";
import { AVAILABLE_CRYPTO } from "../constants/AvailableCurrencies";
import { AVAILABLE_STOCKS } from "../constants/AvailableCurrencies";
import { ChartView } from "./ChartView";
import { WindowView } from "./WindowView";
import { mainPageView } from "./MainPageView";
import { taskBarView } from "./TaskBarView";
import * as CryptoModel from "../model/crypto/CryptoModel";
import * as StocksModel from "../model/stocks/StocksModel";

class ToolsPanelView {
  #CHART_ICON = new URL("../../assets/icons/line-chart.png", import.meta.url);
  #STOCK_CURRENCY = "stocks";
  #CRYPTO_CURRENCY = "crypto";
  #mainPanel = query(".tools-panel");
  #profileUsernameP = query(".profile-username-p");
  #hidePanelBtn = query(".hide-panel-btn");
  #hidePanelBtnImage = query(".hide-panel-btn img");

  #stocksCharts = query(".stocks-charts").querySelector("select");
  #cryptoCharts = query(".crypto-charts").querySelector("select");
  #cryptoChartGenerationBtn = query(".gen-crypto-chart-btn");
  #stocksChartGenerationBtn = query(".gen-stocks-chart-btn");

  #dataUpdateCommandsContainer = query(".data-update-container");
  #availableCryptoUpdates = query(".available-crypto-updates");
  #cryptoFileUpdateBtn = query(".crypto-file-update-btn");
  #cryptoManualUpdateBtn = query(".crypto-manual-update-btn");
  #availableStocksUpdates = query(".available-stocks-updates");
  #stocksFileUpdateBtn = query(".stocks-file-update-btn");
  #stocksManualUpdateBtn = query(".stocks-manual-update-btn");

  #hidePanelHandler = () => {
    this.#mainPanel.classList.toggle("hp");
    this.#hidePanelBtnImage.classList.toggle("rhba");
  };

  setHidePanelHandler() {
    this.#hidePanelBtn.addEventListener("click", this.#hidePanelHandler);
  }

  loadCryptoOptions() {
    AVAILABLE_CRYPTO.forEach((value, key) => {
      const newOption = document.createElement("option");
      newOption.value = key;
      newOption.text = value;
      this.#cryptoCharts.insertAdjacentElement("afterbegin", newOption);
    });
  }

  loadStocksOptions() {
    AVAILABLE_STOCKS.forEach((value, key) => {
      const newOption = document.createElement("option");
      newOption.value = key;
      newOption.text = value;
      this.#stocksCharts.insertAdjacentElement("afterbegin", newOption);
    });
  }

  loadCryptoUpdateOptions() {
    AVAILABLE_CRYPTO.forEach((value, key) => {
      const newOption = document.createElement("option");
      newOption.value = key;
      newOption.text = value;
      this.#availableCryptoUpdates.insertAdjacentElement(
        "afterbegin",
        newOption
      );
    });
  }

  loadStocksUpdateOptions() {
    AVAILABLE_STOCKS.forEach((value, key) => {
      const newOption = document.createElement("option");
      newOption.value = key;
      newOption.text = value;
      this.#availableStocksUpdates.insertAdjacentElement(
        "afterbegin",
        newOption
      );
    });
  }

  initializeCryptoGenButtonListener() {
    this.#cryptoChartGenerationBtn.addEventListener("click", (e) => {
      const windowTitle = AVAILABLE_CRYPTO.get(this.#cryptoCharts.value);
      const currency = this.#cryptoCharts.value;
      this.#generateChart(windowTitle, currency, this.#CRYPTO_CURRENCY);
    });
  }

  initializeStocksGenButtonListener() {
    this.#stocksChartGenerationBtn.addEventListener("click", (e) => {
      const windowTitle = AVAILABLE_STOCKS.get(this.#stocksCharts.value);
      const currency = this.#stocksCharts.value;
      this.#generateChart(windowTitle, currency, this.#STOCK_CURRENCY);
    });
  }

  #generateChart(windowTitle, currency, currencyType) {
    if (currencyType === this.#CRYPTO_CURRENCY) {
      CryptoModel.getCurrency(currency, 1300, 2000).then((res) => {
        this.#chartGenerator(res, windowTitle);
      });
    } else if (currencyType === this.#STOCK_CURRENCY) {
      StocksModel.getCurrency(currency, 1300, 2000).then((res) => {
        this.#chartGenerator(res, windowTitle);
      });
    }
  }

  #chartGenerator(apiResults, windowTitle) {
    const title = mainPageView.addWindowTitle(windowTitle);
    const chart = new ChartView(title);
    const window = new WindowView(
      title,
      chart.getChartHTML(),
      this.#CHART_ICON,
      { width: 700, height: 320 }
    );
    window.createWindow();
    const taskBarIcon = taskBarView.addIcon(title, this.#CHART_ICON);
    window.setTaskbarIcon(taskBarIcon);
    chart.initializeChart();
    let index = 0;
    apiResults.forEach((el) => {
      if (index === apiResults.length - 1) {
        chart.addChartBar(el, index, true);
      } else {
        chart.addChartBar(el, index, false);
      }
      index++;
    });
  }

  displayDataUpdateCommandsByPrivileges() {
    loginCache.getRoles().forEach((role) => {
      if (role.role === "ROLE_OWNER" || role.role === "ROLE_ADMIN") {
        this.#dataUpdateCommandsContainer.classList.remove("dn");
      } else {
        this.#dataUpdateCommandsContainer.classList.add("dn");
      }
    });
  }

  getSelectedCryptoForUpdate() {
    return this.#availableCryptoUpdates.value;
  }
  getSelectedStockForUpdate() {
    return this.#availableStocksUpdates.value;
  }

  setCryptoFileUpdateBtnListener(listener) {
    this.#cryptoFileUpdateBtn.addEventListener("click", (e) => {
      listener(e);
    });
  }
  setCryptoManualUpdateBtnListener(listener) {
    this.#cryptoManualUpdateBtn.addEventListener("click", (e) => {
      listener(e);
    });
  }
  setStocksFileUpdateBtnListener(listener) {
    this.#stocksFileUpdateBtn.addEventListener("click", (e) => {
      listener(e);
    });
  }
  setStocksManualUpdateBtnListener(listener) {
    this.#stocksManualUpdateBtn.addEventListener("click", (e) => {
      listener(e);
    });
  }

  getAvailableCryptoUpdates() {
    return this.#availableCryptoUpdates;
  }
  getAvailableStocksUpdates() {
    return this.#availableStocksUpdates;
  }

  initializeToolsPanelView() {
    this.#profileUsernameP.textContent = loginCache.getUsername();
  }
}

export const toolsPanelView = new ToolsPanelView();
