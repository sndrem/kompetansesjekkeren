const cron = require("node-cron");
const scrape = require("../scraper/scraper");

cron.schedule("0 12,0 * * *", scrape.scrapeAndPopulateDb);
