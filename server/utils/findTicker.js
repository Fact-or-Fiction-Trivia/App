/* eslint-disable no-undef */
const axios = require("axios");
module.exports = async (url) => {
  try {
    const { data } = await axios(url);

    const innerText = data.replace(/<[^>]*>?/gm, "");
    const idxMatches = [];

    var reNASDAQ = /NASDAQ/gi;
    var reNYSE = /NYSE/gi;

    while ((m = reNASDAQ.exec(innerText)) != null) {
      idxMatches.push(m.index);
    }
    while ((m = reNYSE.exec(innerText)) != null) {
      idxMatches.push(m.index);
    }

    const ticker = idxMatches.reduce((tickers, i) => {
      const idx = i;

      const tickerRaw = innerText.substring(idx, idx + 50);

      const indexOfColon = tickerRaw.indexOf(":") + 1;
      let indexOfPara = tickerRaw.indexOf(")");
      if (indexOfPara === -1) {
        indexOfPara = tickerRaw.indexOf("]");
      }
      let ticker = tickerRaw.substring(indexOfColon, indexOfPara);

      if (ticker.includes(",")) {
        ticker = ticker
          .split(",")
          .filter((txt) => !txt.includes(";"))
          .join(",");
      }
      const trimmed = ticker.trim();

      const regExp = new RegExp(`\\b(NYSE|NASDAQ)\\b`, "gi");
      if (!tickers.includes(trimmed) && !trimmed.match(regExp)) {
        tickers += trimmed + " ";
      }
      return tickers;
    }, "");
    return ticker.trim();
  } catch (error) {
    console.log(error);
  }
};
