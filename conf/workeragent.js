var worker_config = {}

worker_config.name = "Worker Agent";
worker_config.ip = 127.0.0.1;
worker_config.port = process.env.WORKER_AGENT || 5003;

module.exports = worker_config;