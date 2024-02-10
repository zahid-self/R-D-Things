import { Queue } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis({ maxRetriesPerRequest: null });

function getQueue(queueName) {
  return new Queue(queueName, { connection: connection });
}

const queues = {
  queue1: getQueue('queue-1'),
  queue2: getQueue('queue-2'),
  queue3: getQueue('queue-3'),
}

async function addJobs() {

  console.log(await Promise.all(Object.entries(queues).map(e => e[1].getActiveCount())));
  const queuesArray = await Promise.all(Object.values(queues));

  queuesArray.map(async (queue, index) => {
    if (await queue.getActiveCount() < 3) {
      queue.add(`Message ${index}`, { task: `Task ${index}` })
    }
  })
}

await addJobs();