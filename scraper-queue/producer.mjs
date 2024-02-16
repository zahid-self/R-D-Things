import { Queue } from "bullmq";
import IORedis from "ioredis";
import puppeteer from "puppeteer"


const connection = new IORedis({ maxRetriesPerRequest: null });
const scraperQueue = new Queue('scraper-queue', { connection: connection });

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new'
  });
  const page = await browser.newPage();
  console.log('Visiting the url');
  await page.goto('https://books.toscrape.com/');
  console.log('Waiting for the selector');
  await page.waitForSelector('.page_inner');
  console.log('Done with waiting for the selector')
  const reuslt = await page.evaluate(() => {
    const titles = [...document.querySelectorAll('.product_pod h3')].map((singleProd) => (singleProd.innerText));
    const links = [...document.querySelectorAll('.product_pod h3')].map((singleProd) => singleProd.querySelector('a').href);
    return { titles, links };
  });
  await browser.close();


  for (let index = 0; index < reuslt.links.length; index++) {
    await scraperQueue.add(`${reuslt.titles[index]}`, { link: reuslt.links[index] }, { delay: 2000 });
  }
})()
