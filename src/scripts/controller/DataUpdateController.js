import * as dataUpdateModel from "../model/data/DataUpdateModel";
import { getAllDataFiles } from "../model/data/FilesModel";
import { getAllDataFiles } from "../model/data/FilesModel";
import { WindowView } from "../view/WindowView";
import { mainPageView } from "../view/MainPageView";
import { taskBarView } from "../view/TaskBarView";
import { dataUpdateView } from "../view/DataUpdateView";
import { toolsPanelView } from "../view/ToolsPanelView";
import { AVAILABLE_CRYPTO } from "../constants/AvailableCurrencies";
import { AVAILABLE_STOCKS } from "../constants/AvailableCurrencies";
const DATA_UPDATE_ICON = new URL(
  "../../assets/icons/data-processing.png",
  import.meta.url
);
const DATA_UPDATE_ICON2 = new URL(
  "../../assets/icons/refresh-data.png",
  import.meta.url
);

const CRYPTO = "crypto";
const STOCKS = "stocks";
let currencyTypeToUpdate;

export const initializeDataUpdateController = function () {
  toolsPanelView.setCryptoFileUpdateBtnListener((event) => {
    displayUpdateWindow("Crypto database update");
    getAvailableFiles();
    currencyTypeToUpdate = CRYPTO;
  });
  toolsPanelView.setStocksFileUpdateBtnListener((event) => {
    displayUpdateWindow("Stocks database update");
    getAvailableFiles();
    currencyTypeToUpdate = STOCKS;
  });

  toolsPanelView.setCryptoManualUpdateBtnListener((event) => {
    displayUpdateWindow("Crypto database update");
    getAvailableFiles();
    currencyTypeToUpdate = CRYPTO;
  });
  toolsPanelView.setStocksManualUpdateBtnListener((event) => {
    displayUpdateWindow("Stocks database update");
    getAvailableFiles();
    currencyTypeToUpdate = STOCKS;
  });
};

const getAvailableFiles = function () {
  getAllDataFiles("csv").then((resp) => {
    dataUpdateView.loadAvailableFiles(resp);
  });
};

const displayUpdateWindow = function (title) {
  const windowTitle = mainPageView.addWindowTitle(title);
  const window = new WindowView(
    windowTitle,
    dataUpdateView.getContent(),
    DATA_UPDATE_ICON2,
    {
      width: 460,
      height: 200,
    }
  );
  window.createWindow();
  const taskBarIcon = taskBarView.addIcon(windowTitle, DATA_UPDATE_ICON2);
  window.setTaskbarIcon(taskBarIcon);
  dataUpdateView.initializeDataUpdateView();

  dataUpdateView.setConfirmBtnListener((event) => {
    dataUpdateView.removeNewDataElements();
    dataUpdateView.displayLoading(true);
    dataUpdateModel.confirmUpdate().then((resp) => {
      if (resp === "Data updated successfully") {
        dataUpdateView.displayLoading(false);
        dataUpdateView.setMessage(resp);
      }
    });
  });
  dataUpdateView.setCancelBtnListener((event) => {
    dataUpdateView.removeNewDataElements();
    dataUpdateModel.cancelUpdate();
  });
  dataUpdateView.setLoadDataBtnListener((event) => {
    dataUpdateView.removeNewDataElements();
    if (currencyTypeToUpdate === CRYPTO) {
      loadCrypoData(
        toolsPanelView.getSelectedCryptoForUpdate(),
        dataUpdateView.getSelectedFile()
      );
    } else if (currencyTypeToUpdate === STOCKS) {
      loadStocksData(
        toolsPanelView.getSelectedStockForUpdate(),
        dataUpdateView.getSelectedFile()
      );
    }
  });
  dataUpdateView.setFilesListListener((event) => {
    getAvailableFiles();
  });
};

const loadCrypoData = function (selectedCrypto, selectedFile) {
  dataUpdateModel
    .getNewCryptoData(selectedCrypto, selectedFile)
    .then((resp) => {
      if (resp.length === 0) {
        dataUpdateView.setMessage("Up to date");
      }
      resp.forEach((el) => {
        dataUpdateView.addNewDataElement(el);
      });
    });
};
const loadStocksData = function (selectedStock, selectedFile) {
  dataUpdateModel.getNewStockData(selectedStock, selectedFile).then((resp) => {
    if (resp.length === 0) {
      dataUpdateView.setMessage("Up to date");
    }
    resp.forEach((el) => {
      dataUpdateView.addNewDataElement(el);
    });
  });
};
