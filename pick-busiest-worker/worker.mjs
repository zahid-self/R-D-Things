import { Worker } from "bullmq";
import IORedis from "ioredis";
import { setTimeout } from "node:timers/promises"

const connection = new IORedis({ maxRetriesPerRequest: null });

function getWorker(queueName) {
  return new Worker(queueName, async job => {
    console.log(job.data);
    await setTimeout(50000)
  }, { connection: connection, concurrency: 1 });
}

const workers = {
  worker1: getWorker('queue-1'),
  worker2: getWorker('queue-2'),
  worker3: getWorker('queue-3'),
}

const worker = new Worker('queue-1', async job => {
  console.log(job.data);
  await setTimeout(5000);
}, { connection: connection, concurrency: 1 });

const worker2 = new Worker('queue-2', async job => {
  console.log(job.data);
  await setTimeout(5000)
}, { connection: connection, concurrency: 1 });

const worker3 = new Worker('queue-3', async job => {
  console.log(job.data);
  await setTimeout(5000)
}, { connection: connection, concurrency: 1 });

// const workersArray = await Promise.all(Object.values(workers));

// workersArray.map(async (queue, index) => {
//   console.log(await queue.getActiveCount())
//   if (await queue.getActiveCount() < 3) {
//     queue.add(`Message ${index}`, { task: `Task ${index}` })
//   }
// })