import { Queue } from "bullmq";
import IORedis from 'ioredis';
const connection = new IORedis({ maxRetriesPerRequest: null });

const notificationQueue = new Queue('email-send', { connection: connection });

async function sendNotification() {
  const message = await notificationQueue.add('Email to Zahid Hasan', {
    email: 'mdjahidhasan920@gmail.com',
    subject: 'How was your day?',
    body: 'Hi Zahid, How are you doing. How was your day?'
  }, { delay: 5000 });
  console.log(`Added message to the queue ${message.id}`)
}

sendNotification();