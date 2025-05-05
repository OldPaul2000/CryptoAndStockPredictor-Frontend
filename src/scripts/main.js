import { query } from "./helper/Query";
import { initializeLoginFunctionality } from "./controller/LoginController";
import { initializeLogoutFunctionality } from "./controller/LogoutController";
import { toolsPanelView } from "./view/ToolsPanelView";
import { taskBarView } from "./view/TaskBarView";
import { WindowView } from "./view/WindowView";
import { ChartView } from "./view/ChartView";
import { ChartViewCopy } from "./view/ChartView copy";
import { windowMovingHandler } from "./helper/WindowMovingLogic";
import { windowResizeHandler } from "./helper/WindowResizeLogic";
import * as cryptoModel from "./model/crypto/CryptoModel";

const CHART_ICON = new URL("../assets/icons/line-chart.png", import.meta.url);

initializeLoginFunctionality();
initializeLogoutFunctionality();
toolsPanelView.initializeToolsPanelView();
taskBarView.initializeViewportSizeListener();
windowMovingHandler.initializeWindowsMoveHandler();
windowResizeHandler.initializeWindowsResizeHandler();

// ============================ FOR TESTING ============================
const removeIconBtn = query(".remove-icon");
const iconIndexField = query(".icon-index");
removeIconBtn.style.width = "7rem";
removeIconBtn.style.height = "2.4rem";
iconIndexField.style.width = "7rem";
iconIndexField.style.height = "2.4rem";
iconIndexField.value = -2;

removeIconBtn.addEventListener("click", () => {
  if (iconIndexField.value === "-1") {
    taskBarView.addIcon("New Icon");
  }
  if (iconIndexField.value === "-2") {
    cryptoModel.getCurrency("ethereum", 0, 100).then((res) => {
      const ethChart = new ChartView("ethereum");

      const windowTitle = "ETH chart";
      const ethWindow = new WindowView(
        windowTitle,
        ethChart.getChartHTML(),
        CHART_ICON
      );
      ethWindow.createWindow();
      const ethIcon = taskBarView.addIcon(windowTitle, CHART_ICON);
      ethWindow.setTaskbarIcon(ethIcon);
      ethChart.initializeChart();
      // btcChart.addChartBars(100);
      // btcChart.addTimestamps(100);
      let index = 0;
      res.forEach((el) => {
        ethChart.addChartBar(el, index);
        index++;
      });
      // console.log(res);
    });
  } else {
    taskBarView.removeIcon(Number.parseInt(iconIndexField.value));
  }
  console.log(taskBarView.getLastIconIndex());
});
// ============================ FOR TESTING ============================
