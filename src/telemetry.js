/**Ref: https://github.com/open-telemetry/opentelemetry-js */

const opentelemetry = require("@opentelemetry/sdk-node");
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
//const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-grpc');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');

const sdk = new opentelemetry.NodeSDK({
  serviceName: process.env.SERVICE_NAME,

  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: process.env.SERVICE_NAME,
  }),

  // ref.: https://npm.io/package/@opentelemetry/auto-instrumentations-node for custom configurations
  instrumentations: [getNodeAutoInstrumentations()],
  // Uses OTEL_EXPORTER_OTLP_ENDPOINT env as collector endpoint. 
  // Ref.: https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/protocol/exporter.md
  traceExporter: new OTLPTraceExporter(),
});

sdk.start() .then(() => console.log('Tracing initialized'))
.catch((error) => console.log('Error initializing tracing', error));;

// gracefully shut down the SDK on process exit
process.on('SIGTERM', () => {
  sdk.shutdown()
    .then(() => console.log('Tracing terminated'))
    .catch((error) => console.log('Error terminating tracing', error))
    .finally(() => process.exit(0));
});