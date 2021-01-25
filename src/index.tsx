import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./service-worker.js");
}

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
function sendToAnalytics(metric: any) {
  let data = {};
  const id = metric.id.split("-")[0];
  if (metric.name === "FCP") {
    const { name, value } = metric;
    data = { name, value, id };
  } else if (metric.name === "TTFB") {
    const { name, value } = metric;
    const {
      domComplete,
      domInteractive,
      duration,
      name: url,
      domainLookupStart,
      domainLookupEnd,
    } = metric.entries[0];
    data = {
      name,
      value,
      id,
      entries: {
        domComplete,
        domInteractive,
        duration,
        name: url,
        domainLookupStart,
        domainLookupEnd,
      },
      window: {
        width: window.screen.width,
        height: window.screen.height,
      },
    };
  }

  if (
    Object.keys(data).length !== 0 &&
    ((!window.location.href.includes("localhost") &&
      !window.location.href.includes("testing")) ||
      window.location.href.includes("show-analytics"))
  ) {
    const body = JSON.stringify(data);
    const url = "https://metrics300k.herokuapp.com/metrics";

    // Use `navigator.sendBeacon()` if available, falling back to `fetch()`
    if (navigator.sendBeacon) {
      navigator.sendBeacon(url, body);
    } else {
      fetch(url, {
        body,
        method: "POST",
      });
    }
  }
}
reportWebVitals(sendToAnalytics);
