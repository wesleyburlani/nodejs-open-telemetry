const amqplib = require('amqplib');
const { logger } = require('./logs');

let rabbitConnection;
let exchange = 'logs'
const rabbitMqListenToMessages = async (callback) => {
  if (!rabbitConnection) {
      rabbitConnection = await amqplib.connect('amqp://user:password@localhost');
  }
  const channel = await rabbitConnection.createChannel();
  await channel.assertExchange(exchange, 'fanout')
  const q = await channel.assertQueue('');
  await channel.bindQueue(q.queue, exchange, '');
  await channel.consume(q.queue, (message) => callback(message.content.toString()), { noAck: true })
}

rabbitMqListenToMessages((message) => logger.info(`Consumer received message: ${message}`))
logger.info(`${process.env.SERVICE_NAME} Running`)