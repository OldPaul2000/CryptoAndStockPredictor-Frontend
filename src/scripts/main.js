import { initializeLoginFunctionality } from "./controller/LoginController";
import { initializeLogoutFunctionality } from "./controller/LogoutController";
import * as DataUpdateModel from "./model/data/DataUpdateModel";
import * as FilesModel from "./model/data/FilesModel";
import { query } from "./helper/Query";
import * as CryptoModel from "./model/crypto/CryptoModel";
import * as StocksModel from "./model/stocks/StocksModel";

initializeLoginFunctionality();
initializeLogoutFunctionality();

const updateBtn = query(".update-btn");
const confirmBtn = query(".confirm-btn");
const cancelBtn = query(".cancel-btn");
const filesBtn = query(".files-list-btn");

const currency = query(".currency-type");
const start = query(".start-result");
const results = query(".results-per-page");
const search = query(".search-crypto");

search.addEventListener("click", () => {
  StocksModel.getCurrency(currency.value, start.value, results.value).then(
    (resp) => {
      console.log(resp);
    }
  );
});
