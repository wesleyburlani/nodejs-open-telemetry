const pino = require('pino');

const logger = pino({
  enabled: process.env.ENABLE_LOGS === 'true',
  level: 'debug',
});


module.exports = {
  logger,
};
