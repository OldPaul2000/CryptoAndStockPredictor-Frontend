import { query } from "../helper/Query";

export class ChartViewCopy {
  #chartName;
  #chart;
  #mainContent;
  #mainData;
  #graph;
  #scaleLinesContainer;
  #xScaleLine;
  #yScaleLine;
  #timestamp;
  #priceScaleContent;

  #chartBars = [];
  #timestampElements = [];

  #SCROLL_FACTOR = 4;
  #graphWidth;
  #graphHeight;

  constructor(chartName) {
    this.#chartName = chartName;
  }

  getChartHTML() {
    const structure = `<div class=\"chart\" data-chart-name=\"${
      this.#chartName
    }\">
      <div class=\"main-content\">
        <div class=\"main-data\"></div>
        <div class=\"scale-lines-container\">
            <div class=\"x-scale-line\"></div>
            <div class=\"y-scale-line\"></div>
        </div>
        <div class=\"graph\"></div>
        <div class=\"timestamp\"></div>
      </div>
      <div class=\"price-scale\">
        <div class=\"scale-content\"></div>
      </div>
    </div>`;

    return structure;
  }

  getChartElement() {
    return this.#chart;
  }

  // For TESTING
  addTimestamps(timestampsNumber) {
    for (let i = 0; i < timestampsNumber; i++) {
      const html = `<div class=\"timestamp-el\">${i + 1}</div>`;
      this.#timestamp.insertAdjacentHTML("beforeend", html);
    }
  }

  // For TESTING
  addChartBars(barsNumber) {
    for (let i = 0; i < barsNumber; i++) {
      const html = `<div class=\"chart-bar\">${i + 1}</div>`;
      this.#graph.insertAdjacentHTML("beforeend", html);
    }
  }

  #scrollListener = (e) => {
    const scrollLeft = e.target.scrollLeft;
    this.#timestamp.scrollLeft = scrollLeft;
  };
  #initializeGraphScrollEvent() {
    this.#graph.addEventListener("scroll", this.#scrollListener);
  }

  #initializeGraphResizeObserver() {
    const resizeObserver = new ResizeObserver((entry) => {
      const dimensions = {
        width: entry[0].contentRect.width,
        height: entry[0].contentRect.height,
      };
      this.#graphWidth = dimensions.width;
      this.#graphHeight = dimensions.height;
      // this.#setScaleLinesDimensions(dimensions.width, dimensions.height);
      console.log(dimensions);
      console.log(getComputedStyle(this.#priceScaleContent).height);
    });
    resizeObserver.observe(this.#graph);
  }

  #mouseIsDown = false;
  #mouseIsUp = false;
  #mouseIsIn = false;
  #mouseIsOut = false;
  #currentXOffset = 0;
  #graphSlideScrollHandler(zeroX) {
    if (this.#mouseIsDown) {
      if (this.#currentXOffset < zeroX) {
        this.#timestamp.scrollLeft -= this.#SCROLL_FACTOR;
        this.#graph.scrollLeft -= this.#SCROLL_FACTOR;
      } else if (this.#currentXOffset > zeroX) {
        this.#timestamp.scrollLeft += this.#SCROLL_FACTOR;
        this.#graph.scrollLeft += this.#SCROLL_FACTOR;
      }
      this.#currentXOffset = zeroX;
    }
  }

  #initializeGraphSlideScrollHandler() {
    this.#mainContent.addEventListener("mousedown", (e) => {
      this.#mouseIsDown = true;
      this.#mouseIsUp = false;
    });
    this.#mainContent.addEventListener("mouseup", (e) => {
      this.#mouseIsDown = false;
      this.#mouseIsUp = true;
    });
    this.#mainContent.addEventListener("mousemove", (e) => {
      const bounds = e.currentTarget.getBoundingClientRect();
      const zeroX = Math.abs(bounds.x - e.clientX);
      const zeroY = Math.abs(bounds.y - e.clientY);
      // this.#graphSlideScrollHandler(zeroX);
      this.#setScaleLinesPosition(e);
      // console.log({ zeroX, zeroY });
    });
    this.#mainContent.addEventListener("mouseout", (e) => {
      // this.#mouseIsOut = true;
      // this.#hideScaleLines();
      console.log("Mouse out");
    });
    this.#graph.addEventListener("mouseenter", (e) => {
      console.log("Enter");
    });
  }

  #setScaleLinesDimensions(graphWidth, graphHeight) {
    this.#xScaleLine.style.width = graphWidth + "px";
    this.#yScaleLine.style.height = graphHeight + "px";
  }

  #setScaleLinesPosition(event) {
    let target;
    console.log(event.currentTarget);
    // if (
    //   event.target.classList[0] === "y-scale-line" ||
    //   event.target.classList[0] === "x-scale-line"
    // ) {
    //   target = event.target.currentTarget;
    // } else {
    //   target = event.target;
    // }
    // if (event.target.classList[0] === "scale-lines-container") {
    const bounds = target.getBoundingClientRect();

    const zeroX = Math.abs(bounds.x - event.clientX);
    const zeroY = Math.abs(bounds.y - event.clientY);
    console.log({ zeroX, zeroY });
    this.#xScaleLine.style.top = zeroY + "px";
    this.#yScaleLine.style.left = zeroX + "px";
    // }
  }

  #hideScaleLines() {
    this.#xScaleLine.classList.add("dn");
    this.#yScaleLine.classList.add("dn");
  }

  initializeChart() {
    this.#chart = query(".chart");
    this.#mainContent = this.#chart.querySelector(".main-content");
    this.#mainData = this.#mainContent.querySelector(".main-data");
    this.#graph = this.#mainContent.querySelector(".graph");
    this.#scaleLinesContainer = this.#mainContent.querySelector(
      ".scale-lines-container"
    );
    this.#xScaleLine = this.#scaleLinesContainer.querySelector(".x-scale-line");
    this.#yScaleLine = this.#scaleLinesContainer.querySelector(".y-scale-line");
    this.#timestamp = this.#mainContent.querySelector(".timestamp");
    this.#priceScaleContent = this.#chart.querySelector(".scale-content");
    this.#initializeGraphScrollEvent();
    this.#initializeGraphResizeObserver();
    this.#initializeGraphSlideScrollHandler();
  }
}
