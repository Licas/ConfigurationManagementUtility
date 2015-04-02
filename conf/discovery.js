var discovery_config = {}

discovery_config.name = "Discovery Agent";
discovery_config.ip = "127.0.0.1";
discovery_config.port = process.env.DISCOVERY_AGENT || 5002;

module.exports = discovery_config;