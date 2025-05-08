import { query } from "../helper/Query";

export class ChartView {
  #chartName;
  #chart;
  #mainData;
  #graph;
  #xScaleLine;
  #yScaleLine;
  #timestamp;
  #priceScaleContent;
  #priceScaleEl1;
  #priceScaleEl2;
  #priceScaleEl3;
  #priceScaleEl4;
  #priceScaleEl5;
  #priceScaleEl6;
  #priceScaleCursor;
  #scaleCursorText;

  // Finance related info
  #currencyDate;
  #close;
  #volume;
  #open;
  #high;
  #low;
  #minVisibleOpenPrice;
  #maxVisibleOpenPrice;
  #minVisibleClosePrice;
  #maxVisibleClosePrice;

  #chartBars = [];
  #timestampElements = [];
  #currencyObjects = [];

  #SCROLL_FACTOR = 14;
  #currentXScroll = 0;
  #lastXScroll = 0;
  #currentScrollBarIndex = 0;
  #lastVisibleBarIndex = 0;
  #currentBarHoverIndex = 0;
  #YScaleLineLeftAbsolutePosition;
  #graphWidth;
  #graphHeight = 200;
  #barHeightRatio;

  constructor(chartName) {
    this.#chartName = chartName;
  }

  getChartHTML() {
    const structure = `<div class=\"chart\" data-chart-name=\"${
      this.#chartName
    }\">
      <div class=\"main-content\">
        <div class=\"main-data\">
          <p class=\"date\">Date: 20/03/2042</p>
          <p class=\"close-last\">Close/Last: </p>
          <p class=\"volume\">Volume: </p>
          <p class=\"open\">Open: </p>
          <p class=\"high\">High: </p>
          <p class=\"low\">Low: </p>
        </div>
        <div class=\"graph\">
          <div class=\"x-scale-line\"></div>
          <div class=\"y-scale-line\"></div>
        </div>
        <div class=\"timestamp\"></div>
      </div>
      <div class=\"price-scale\">
        <div class=\"scale-content\">
          <p class=\"scale-el scale-el-1\"></p>
          <p class=\"scale-el scale-el-2\"></p>
          <p class=\"scale-el scale-el-3\"></p>
          <p class=\"scale-el scale-el-4\"></p>
          <p class=\"scale-el scale-el-5\"></p>
          <p class=\"scale-el scale-el-6\"></p>
          <div class=\"price-scale-cursor\">
            <p class=\"cursor-price-text\">1422.42</p>
          </div>
        </div>
      </div>
    </div>`;

    return structure;
  }

  getChartElement() {
    return this.#chart;
  }

  addChartBar(currencyObject, index, isLastElement) {
    const bar = document.createElement("div");
    bar.classList.add("chart-bar");
    this.#graph.insertAdjacentElement("beforeend", bar);

    this.#chartBars.push(bar);
    this.#setBarColors(currencyObject, bar);
    this.#currencyObjects.push(currencyObject);
    this.#addTimestamp(currencyObject.date, index, isLastElement);
    this.#setCurrencyDataValue(currencyObject);
    this.#graph.scrollLeft = this.#chartBars.length * this.#SCROLL_FACTOR;
    this.#currentXScroll = this.#graph.scrollLeft;
    this.#currentScrollBarIndex = Math.ceil(
      this.#currentXScroll / this.#SCROLL_FACTOR
    );
    this.#lastVisibleBarIndex = this.#chartBars.length - 1;
    this.#calculateBarHeightRatio();
    this.#calculateBarHeight(currencyObject.close, bar);
    this.#calculateMinAndMaxOpenAndClose();
    this.#setPriceScaleElementsValues();
  }

  #lastYear;
  #lastMonth;
  #lastTimestampWasYear = true;
  #lastTimestampWasMonth = false;
  #firstYear = false;
  #timestampElementLeftMargin;
  #barsNumberUntilNextTimestamp = 0;
  #addTimestamp(date, currencyObjectIndex, isLastElement) {
    // console.log(date, isLastElement);
    // console.log(this.#chartBars[this.#chartBars.length - 1].style.left);
    const year = date.slice(0, 4);
    const month = date.slice(5, 7);
    let element;
    if (currencyObjectIndex === 0) {
      element = document.createElement("div");
      element.classList.add("timestamp-el");
      element.innerText = year;
      this.#timestamp.insertAdjacentElement("beforeend", element);
      this.#lastMonth = Number.parseInt(month);
      this.#timestampElements.push(element);
      this.#lastTimestampWasYear = true;
      this.#lastTimestampWasMonth = false;
    } else {
      if (Number.parseInt(month) > this.#lastMonth) {
        element = document.createElement("div");
        element.classList.add("timestamp-el");
        element.innerText = (this.#lastMonth + "").padStart(2, "0");
        element.style.marginLeft =
          this.#calculateTimestampLeftMargin(true) + "px";
        this.#timestamp.insertAdjacentElement("beforeend", element);
        this.#timestampElements.push(element);
        this.#lastTimestampWasYear = false;
        this.#lastTimestampWasMonth = true;
        this.#barsNumberUntilNextTimestamp = 0;
      } else if (Number.parseInt(year) > this.#lastYear) {
        element = document.createElement("div");
        element.classList.add("timestamp-el");
        element.innerText = this.#lastYear;
        element.style.marginLeft =
          this.#calculateTimestampLeftMargin(false) + "px";
        this.#timestamp.insertAdjacentElement("beforeend", element);
        this.#timestampElements.push(element);
        this.#lastTimestampWasYear = true;
        this.#lastTimestampWasMonth = false;
        this.#firstYear = true;
        this.#barsNumberUntilNextTimestamp = 0;
      } else if (isLastElement) {
        element = document.createElement("div");
        element.classList.add("timestamp-el");
        element.innerText = month;
        element.style.marginLeft =
          this.#calculateTimestampLeftMargin(true) + "px";
        this.#timestamp.insertAdjacentElement("beforeend", element);
        this.#timestampElements.push(element);
        this.#lastTimestampWasYear = false;
        this.#lastTimestampWasMonth = true;
        this.#barsNumberUntilNextTimestamp = 0;
      }
      // It doesn't add last element
    }
    this.#lastYear = Number.parseInt(date.slice(0, 4));
    this.#lastMonth = Number.parseInt(date.slice(5, 7));
    this.#barsNumberUntilNextTimestamp++;
  }

  #calculateTimestampLeftMargin(isMonth) {
    let margin;
    if (this.#lastTimestampWasYear) {
      if (!this.#firstYear) {
        margin =
          (this.#barsNumberUntilNextTimestamp - 3) *
          (this.#SCROLL_FACTOR - 0.15);
      } else {
        margin =
          (this.#barsNumberUntilNextTimestamp - 1) * this.#SCROLL_FACTOR - 6;
      }
    } else {
      if (isMonth) {
        margin =
          (this.#barsNumberUntilNextTimestamp - 1.5) * this.#SCROLL_FACTOR +
          5.7;
      } else {
        margin =
          (this.#barsNumberUntilNextTimestamp - 1.5) * this.#SCROLL_FACTOR;
      }
    }
    return margin;
  }

  #setPriceScaleElementsValues() {
    const maxPrice = Number.parseFloat(this.#maxVisibleClosePrice);
    const diff = maxPrice / 5;
    this.#priceScaleEl1.textContent = (5 * diff).toFixed(2);
    this.#priceScaleEl2.textContent = (4 * diff).toFixed(2);
    this.#priceScaleEl3.textContent = (3 * diff).toFixed(2);
    this.#priceScaleEl4.textContent = (2 * diff).toFixed(2);
    this.#priceScaleEl5.textContent = diff.toFixed(2);
    this.#priceScaleEl6.textContent = 0;
  }

  #calculateBarHeight(closeValue, bar) {
    bar.style.height = this.#barHeightRatio * closeValue + "px";
  }

  #calculateBarHeightRatio() {
    this.#barHeightRatio = this.#graphHeight / this.#maxVisibleClosePrice;
  }

  #setBarColors(currentCurrencyObject, chartBar) {
    if (this.#currencyObjects.length === 0) {
      chartBar.classList.add("hgr-c");
    } else {
      if (
        currentCurrencyObject.close <
        this.#currencyObjects[this.#currencyObjects.length - 1].close
      ) {
        chartBar.classList.add("lwr-c");
      } else {
        chartBar.classList.add("hgr-c");
      }
    }
  }

  #calculateMinAndMaxOpenAndClose() {
    this.#minVisibleOpenPrice = 1000000000;
    this.#minVisibleClosePrice = 1000000000;
    this.#maxVisibleOpenPrice = 0;
    this.#maxVisibleClosePrice = 0;
    if (this.#lastVisibleBarIndex > this.#currencyObjects.length - 1) {
      this.#lastVisibleBarIndex = this.#currencyObjects.length - 1;
    }
    for (
      let i = this.#currentScrollBarIndex;
      i < this.#lastVisibleBarIndex;
      i++
    ) {
      const currencyObj = this.#currencyObjects[i];
      if (currencyObj.open < this.#minVisibleOpenPrice) {
        this.#minVisibleOpenPrice = currencyObj.open;
      }
      if (currencyObj.open > this.#maxVisibleOpenPrice) {
        this.#maxVisibleOpenPrice = currencyObj.open;
      }
      if (currencyObj.close < this.#minVisibleClosePrice) {
        this.#minVisibleClosePrice = currencyObj.close;
      }
      if (currencyObj.close > this.#maxVisibleClosePrice) {
        this.#maxVisibleClosePrice = currencyObj.close;
      }
      this.#calculateBarHeight(
        this.#currencyObjects[i].close,
        this.#chartBars[i]
      );
    }
  }

  #setCurrencyDataValue(currencyObject) {
    if (currencyObject) {
      this.#currencyDate.textContent = `Date: ${currencyObject.date}`;
      this.#close.textContent = `Close/Last: ${currencyObject.close}`;
      if (currencyObject.volume === -1) {
        this.#volume.textContent = `Volume: null`;
      } else {
        this.#volume.textContent = `Volume: ${currencyObject.volume}`;
      }
      this.#open.textContent = `Open: ${currencyObject.open}`;
      this.#high.textContent = `High: ${currencyObject.high}`;
      this.#low.textContent = `Low: ${currencyObject.low}`;
    }
  }

  #scrollListener = (e) => {
    const scrollLeft = e.target.scrollLeft;
    this.#timestamp.scrollLeft = scrollLeft;
  };
  #initializeGraphScrollEvent() {
    this.#graph.addEventListener("scroll", this.#scrollListener);
  }

  #WIDTH_DIFFERENCE = 90;
  #initializeGraphResizeObserver() {
    const resizeObserver = new ResizeObserver((entry) => {
      const dimensions = {
        width: entry[0].contentRect.width,
        height: entry[0].contentRect.height,
      };
      this.#graphWidth = dimensions.width;
      this.#graphHeight = dimensions.height;
      this.#currentXScroll = this.#graph.scrollLeft;
      this.#calculateMinAndMaxOpenAndClose();
      this.#calculateBarHeightRatio();
    });
    resizeObserver.observe(this.#graph);
  }

  #mouseIsDown = false;

  #currentXOffset = 0;
  #graphSlideScrollHandler(graphZeroX) {
    if (this.#mouseIsDown) {
      if (this.#currentXOffset < graphZeroX) {
        this.#timestamp.scrollLeft =
          Math.floor(this.#timestamp.scrollLeft) - this.#SCROLL_FACTOR;
        this.#graph.scrollLeft =
          Math.floor(this.#graph.scrollLeft) - this.#SCROLL_FACTOR;
        this.#currentXScroll = Math.floor(this.#graph.scrollLeft);
      } else if (this.#currentXOffset > graphZeroX) {
        this.#timestamp.scrollLeft =
          Math.floor(this.#timestamp.scrollLeft) + this.#SCROLL_FACTOR;
        this.#graph.scrollLeft =
          Math.floor(this.#graph.scrollLeft) + this.#SCROLL_FACTOR;
        this.#currentXScroll = this.#graph.scrollLeft;
        this.#lastXScroll = this.#currentXScroll;
      }
      this.#currentScrollBarIndex = Math.round(
        this.#currentXScroll / this.#SCROLL_FACTOR
      );
      this.#lastVisibleBarIndex = Math.floor(
        (this.#graphWidth + this.#WIDTH_DIFFERENCE) / this.#SCROLL_FACTOR +
          this.#currentScrollBarIndex
      );
      this.#calculateMinAndMaxOpenAndClose();
      this.#calculateBarHeightRatio();
      this.#setPriceScaleElementsValues();
      this.#currentXOffset = graphZeroX;
    }
  }

  #initializeGraphHandlers() {
    this.#graph.addEventListener("mousedown", (e) => {
      this.#mouseIsDown = true;
    });
    this.#graph.addEventListener("mouseup", (e) => {
      this.#mouseIsDown = false;
    });
    this.#graph.addEventListener("mousemove", (e) => {
      const bounds = e.currentTarget.getBoundingClientRect();
      const graphZeroX = Math.abs(bounds.x - e.clientX);
      const graphZeroY = Math.abs(bounds.y - e.clientY);
      this.#graphSlideScrollHandler(graphZeroX);
      this.#setScaleLinesPosition(graphZeroX, graphZeroY);
      this.#setPriceScaleCursorPosition(graphZeroY);
      this.#setPriceCursorText(graphZeroY);
    });
    this.#graph.addEventListener("mouseout", (e) => {
      if (this.#cursorExitedFromGraph(e)) {
        this.#hideScaleLines();
        this.#hidePriceScaleCursor();
        this.#setCurrencyDataValue(
          this.#currencyObjects[this.#currencyObjects.length - 1]
        );
        this.#mouseIsDown = false;
      }
    });
    this.#graph.addEventListener("mouseenter", (e) => {
      this.#displayScaleLines();
      this.#displayPriceScaleCursor();
    });
  }

  #setPriceCursorText(y) {
    const priceScaleCursorHeight = Number.parseInt(
      getComputedStyle(this.#priceScaleCursor).height
    );
    const maxPrice = Number.parseFloat(this.#maxVisibleClosePrice);
    const topPositionReversed = this.#graphHeight - y;
    const hoverPercentage = topPositionReversed / this.#graphHeight;
    const cursorText = (this.#maxVisibleClosePrice * hoverPercentage).toFixed(
      2
    );
    this.#scaleCursorText.textContent = cursorText;
  }

  #setPriceScaleCursorPosition(y) {
    const cursorHeight = Number.parseInt(
      getComputedStyle(this.#priceScaleCursor).height
    );
    this.#priceScaleCursor.style.top = y - (cursorHeight - 2) / 2 + "px";
  }

  #setScaleLinesPosition(x, y) {
    this.#xScaleLine.style.top = y + "px";
    this.#xScaleLine.style.left = this.#currentXScroll + "px";
    const yScaleLineXPos = this.#setYScaleLinePos(x);
    if (this.#currentBarHoverIndex <= this.#chartBars.length) {
      this.#yScaleLine.style.left = yScaleLineXPos + "px";
    }

    this.#YScaleLineLeftAbsolutePosition =
      Number.parseInt(this.#yScaleLine.style.left) - this.#currentXScroll;
  }

  #setYScaleLinePos(x) {
    const chartBarRange = x % 14;
    this.#currentBarHoverIndex = Math.ceil((this.#currentXScroll + x) / 14);
    let pos;
    if (chartBarRange >= 3 && chartBarRange <= 9) {
      pos =
        this.#currentBarHoverIndex * this.#SCROLL_FACTOR -
        this.#SCROLL_FACTOR / 2;
    }
    this.#setCurrencyDataValue(
      this.#currencyObjects[this.#currentBarHoverIndex - 1]
    );
    return pos;
  }

  #hidePriceScaleCursor() {
    this.#priceScaleCursor.classList.add("dn");
  }

  #displayPriceScaleCursor() {
    this.#priceScaleCursor.classList.remove("dn");
  }

  #displayScaleLines() {
    this.#xScaleLine.classList.remove("dn");
    this.#yScaleLine.classList.remove("dn");
  }

  #hideScaleLines() {
    this.#xScaleLine.classList.add("dn");
    this.#yScaleLine.classList.add("dn");
  }

  #GRAPH_EXIT_ELEMENTS = new Set([
    "main-data",
    "scale-content",
    "main-page",
    "timestamp",
    "timestamp-el",
    "chart",
    "price-scale-cursor",
    "main-content",
    "cursor-price-text",
    "price-scale",
  ]);
  #cursorExitedFromGraph(event) {
    const outTarget = event.toElement;
    if (this.#GRAPH_EXIT_ELEMENTS.has(outTarget.classList[0])) {
      return true;
    }
    return false;
  }

  initializeChart() {
    this.#chart = query(".chart");
    const mainContent = this.#chart.querySelector(".main-content");
    this.#mainData = mainContent.querySelector(".main-data");
    this.#graph = mainContent.querySelector(".graph");
    this.#xScaleLine = this.#graph.querySelector(".x-scale-line");
    this.#yScaleLine = this.#graph.querySelector(".y-scale-line");
    this.#timestamp = mainContent.querySelector(".timestamp");
    this.#priceScaleContent = this.#chart.querySelector(".scale-content");
    this.#currencyDate = this.#mainData.querySelector(".date");
    this.#close = this.#mainData.querySelector(".close-last");
    this.#volume = this.#mainData.querySelector(".volume");
    this.#open = this.#mainData.querySelector(".open");
    this.#high = this.#mainData.querySelector(".high");
    this.#low = this.#mainData.querySelector(".low");
    this.#priceScaleEl1 = this.#priceScaleContent.querySelector(".scale-el-1");
    this.#priceScaleEl2 = this.#priceScaleContent.querySelector(".scale-el-2");
    this.#priceScaleEl3 = this.#priceScaleContent.querySelector(".scale-el-3");
    this.#priceScaleEl4 = this.#priceScaleContent.querySelector(".scale-el-4");
    this.#priceScaleEl5 = this.#priceScaleContent.querySelector(".scale-el-5");
    this.#priceScaleEl6 = this.#priceScaleContent.querySelector(".scale-el-6");
    this.#priceScaleCursor = this.#priceScaleContent.querySelector(
      ".price-scale-cursor"
    );
    this.#scaleCursorText =
      this.#priceScaleCursor.querySelector(".cursor-price-text");
    this.#initializeGraphScrollEvent();
    this.#initializeGraphResizeObserver();
    this.#initializeGraphHandlers();
  }
}
