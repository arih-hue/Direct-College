import { Queue } from "bullmq";

import { createBullConnection } from "../config/bullmqConnection.js";
import { defaultJobOptions } from "./defaultJobOptions.js";
import { QUEUE_NAMES, type QueueName } from "./queueNames.js";

let connection: ReturnType<typeof createBullConnection> | null = null;

function getConnection() {
  if (!connection) {
    connection = createBullConnection();
  }
  return connection;
}

const queueCache = new Map<QueueName, Queue>();

export function getQueue(name: QueueName): Queue {
  let q = queueCache.get(name);
  if (!q) {
    q = new Queue(name, {
      connection: getConnection(),
      defaultJobOptions,
    });
    queueCache.set(name, q);
  }
  return q;
}

export function getAllQueueNames(): QueueName[] {
  return Object.values(QUEUE_NAMES);
}
