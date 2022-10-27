# Node JS Open Telemetry 

This is an implementation of Open Telemetry using Node JS with an environment that uses AMQP and HTTP to communicate and sends Tracing data to the OTLP Collector, which exports the data to Jaeguer.

<p align="center">
  <img src="./docs/assets/architecture.png" width=50% height=50%>
</p>
In this implementation, we have 2 applications: `publisher` and `consumer`. The publisher exposes an HTTP endpoint on "/" and once it receives a GET request it sends a message to RabbitMQ under the exchange "logs", which is consumed by the `consumer`. 
