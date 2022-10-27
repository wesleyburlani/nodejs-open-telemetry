const amqplib = require('amqplib');
const express = require('express');
const { logger } = require('./logs');

const app = express()
const port = process.env.PORT || 3000
let rabbitConnection;

/* An exchange is where the rabbitMq computation takes place. 
According to the messaging strategy defined by the exchange type, messages are sent to an exchange that distributes them to consumers. */
const exchange = 'logs'
const sendRabbitMqMessage = async (message) => {
  if (!rabbitConnection) {
    rabbitConnection = await amqplib.connect('amqp://user:password@localhost');
  }
  
  const channel = await rabbitConnection.createChannel();
  /* Type "fanout" means sending the message to all consumers that subscribed to that exchange. */
  await channel.assertExchange(exchange , 'fanout')
  /* Notice that we pass an empty string as the queue name. This means the queue will be defined per consumer. */
  await channel.publish(exchange, '', Buffer.from(message))
}


app.get('/', async (req, res) => {
  const message = 'Hello World!'
  logger.info(`Send message: '${message}'`);
  await sendRabbitMqMessage(message);
  res.send(message)
});


app.listen(port, () => {
  logger.info(`${process.env.SERVICE_NAME} Running`)
})