const { Worker } = require('bullmq');
const path = require('path');
const config = require('../../config/config');
const logger = require('../../config/logger');

// factory for creating workers by passing the workerfile name and the work name
const createWorker = async (name, filename) => {
  const processorPath = path.join(__dirname, filename);
  const worker = new Worker(name, processorPath, {
    connection: {
      host: config.redis.host,
      port: config.redis.port,
    },
  });

  worker.on('completed', (job) =>
    logger.info(`${job.name} job completed ${job.id} `),
  );
  worker.on('failed', (job) =>
    logger.error(` ${job.name} ${job.id} failed for ${job.failedReason} `),
  );
};

module.exports = createWorker;
