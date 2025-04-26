import { query } from "./helper/Query";
import { initializeLoginFunctionality } from "./controller/LoginController";
import { initializeLogoutFunctionality } from "./controller/LogoutController";
import { toolsPanelView } from "./view/ToolsPanelView";
import { taskBarView } from "./view/TaskBarView";
import { WindowView } from "./view/WindowView";
import { windowMovingHandler } from "./helper/WindowMovingLogic";
import { windowResizeHandler } from "./helper/WindowResizeLogic";

const CHART_ICON = new URL("../assets/icons/line-chart.png", import.meta.url);

initializeLoginFunctionality();
initializeLogoutFunctionality();
toolsPanelView.initializeToolsPanelView();
taskBarView.initializeViewportSizeListener();
windowMovingHandler.initializeWindowsMoveHandler();
windowResizeHandler.initializeWindowsResizeHandler();

// taskBarView.addIcon("Icon 2fasafsasffas", CHART_ICON);
// taskBarView.addIcon("Icon 3", CHART_ICON);
// taskBarView.addIcon("Icon 4", CHART_ICON);
// taskBarView.addIcon("Icon 5", CHART_ICON);

// ============================ FOR TESTING ============================
const removeIconBtn = query(".remove-icon");
const iconIndexField = query(".icon-index");
removeIconBtn.style.width = "7rem";
removeIconBtn.style.height = "2.4rem";
iconIndexField.style.width = "7rem";
iconIndexField.style.height = "2.4rem";

removeIconBtn.addEventListener("click", () => {
  if (iconIndexField.value === "-1") {
    taskBarView.addIcon("New Icon");
  } else {
    taskBarView.removeIcon(Number.parseInt(iconIndexField.value));
  }
  console.log(taskBarView.getLastIconIndex());
});
// ============================ FOR TESTING ============================

const windowTitle = "BTC chart";
const btcWindow = new WindowView(windowTitle, "BTC", CHART_ICON);
btcWindow.createWindow();
const btcIcon = taskBarView.addIcon(windowTitle, CHART_ICON);
btcWindow.setTaskbarIcon(btcIcon);

const windowTitle2 = "BTC chart 2";
const btcWindow2 = new WindowView(windowTitle2, "BTC", CHART_ICON);
btcWindow2.createWindow();
const btcIcon2 = taskBarView.addIcon(windowTitle2, CHART_ICON);
btcWindow2.setTaskbarIcon(btcIcon2);

const windowTitle3 = "BTC chart 3";
const btcWindow3 = new WindowView(windowTitle3, "BTC", CHART_ICON);
btcWindow3.createWindow();
const btcIcon3 = taskBarView.addIcon(windowTitle3, CHART_ICON);
btcWindow3.setTaskbarIcon(btcIcon3);

// const windowTitle4 = "BTC chart 4";
// const btcWindow4 = new WindowView(windowTitle4, "BTC", CHART_ICON);
// btcWindow4.createWindow();
// const btcIcon4 = taskBarView.addIcon(windowTitle4, CHART_ICON);
// btcWindow4.setTaskbarIcon(btcIcon4);

// const windowTitle5 = "BTC chart 5";
// const btcWindow5 = new WindowView(windowTitle5, "BTC", CHART_ICON);
// btcWindow5.createWindow();
// const btcIcon5 = taskBarView.addIcon(windowTitle5, CHART_ICON);
// btcWindow5.setTaskbarIcon(btcIcon5);
