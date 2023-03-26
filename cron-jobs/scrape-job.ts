import cron from "node-cron";
import scrape from "../scraper/scraper";

cron.schedule("0 12,0 * * *", scrape.scrapeAndPopulateDb);
cron.schedule("0 7 * * *", scrape.scrapeAndPopulateDb);
