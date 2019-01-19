const puppeteer = require("puppeteer");
const url = "https://darksky.net";

const getWeather = async (lat, lng, callback) => {
  const browser = await puppeteer.launch({
    executablePath: "/usr/bin/chromium-browser",
    args: ['--disable-dev-shm-usage'] // Docker hack to allow /tmp usage
  });
  try {
    console.log(`Getting weather for ${lat} ${lng}...`);
    const page = await browser.newPage();
    await page.goto(url);
    const inputSelector = '#searchForm > input[type="text"]';
    // clear pre-set input
    await page.click(inputSelector, { clickCount: 3 });
    await page.keyboard.press("Backspace");
    // enter text into input field
    const inputText = `${lat} ${lng}`;
    await page.type(inputSelector, inputText);
    await page.screenshot({ path: "textInput.png" });

    // click submit icon
    // Wait until next page has loaded
    console.log("Navigating to results page...");
    await Promise.all([
      page.screenshot({ path: "pageClick.png" }),
      page.waitForNavigation({ waitUntil: "networkidle0" }), // The promise resolves after navigation has finished
      page.click("#searchForm > a.searchButton")
    ]);

    await page.screenshot({ path: "results.png" });
    // Get results
    console.log("Getting results...");
    const results = await page.evaluate(() => {
      const temperature = document.querySelector(
        "#title > span.currently > span.desc.swap > span.summary.swap"
      ).textContent;
      const apparentTemperature = document.querySelector(
        "#title > span.currently > span.desc.swap > span.summary-high-low > span:nth-child(1)"
      ).childNodes[1].textContent;
      return {
        temperature,
        apparentTemperature
      };
    });
    callback(null, results);
  } catch (e) {
    console.error(e);
  } finally {
    browser.close();
  }
};

module.exports.getWeather = getWeather;
