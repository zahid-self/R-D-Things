import { Worker, QueueEvents } from "bullmq";
import IORedis from "ioredis";
import puppeteer from "puppeteer";

const connection = new IORedis({ maxRetriesPerRequest: null });
const queueEvents = new QueueEvents('scraper-queue');

const scraperWorker = new Worker('scraper-queue', async (job) => {
  console.log('Worker received a message');
  const browser = await puppeteer.launch({
    headless: 'new'
  });
  const page = await browser.newPage();
  await page.goto(job.data.link);
  console.log(`Going to ${job.data.link}`)

  await page.waitForSelector('.page_inner');
  console.log(`Done waiting for selector`);

  const result = await page.evaluate(() => {
    const title = document.querySelector('.product_main h1').innerText;
    const price = document.querySelector('.product_main p.price_color').innerText;
    const stock = document.querySelector('.product_main p.instock').innerText;
    const descriptionSubheading = document.querySelector('.product_description h2').innerText;
    const description = document.querySelector('#product_description').nextElementSibling.textContent.trim();

    return {
      title, price, stock, descriptionSubheading, description
    }
  });
  console.log(result);
  await browser.close();
}, { connection: connection, concurrency: 1 });

queueEvents.on('waiting', ({ jobId }) => {
  console.log(`A job with ID ${jobId} is waiting`);
});