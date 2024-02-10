import { Worker, QueueEvents } from "bullmq";
import IORedis from 'ioredis';

const queueEvents = new QueueEvents('email-send');
const connection = new IORedis({ maxRetriesPerRequest: null });

const notificationWorker = new Worker('email-send', async (job) => {
  console.log(`Received a new message`);
}, { connection: connection });

queueEvents.on('waiting', ({ jobId }) => {
  console.log(`A job with ID ${jobId} is waiting`);
});

queueEvents.on('active', ({ jobId, prev }) => {
  console.log(`Job ${jobId} is now active; previous status was ${prev}`);
});


notificationWorker.on('completed', job => {
  console.log(`Sent email to ${job.data.email}`)
})
