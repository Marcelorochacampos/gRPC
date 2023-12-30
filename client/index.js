const express = require('express');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const app = express();
const PROTO_PATH = __dirname + '/hero.proto'

/**
 * 
 * Load the gRPC .proto package definition
 */
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

/**
 * 
 * Load service from .proto file
 */
const HeroServiceProto = grpc.loadPackageDefinition(packageDefinition).hero.HeroService;

/**
 * 
 * Handshake with the server
 */
const client = new HeroServiceProto('localhost:50051', grpc.credentials.createInsecure());

/**
 * 
 * Unary call
 * Similar to a HTTP request with a single request / response
 */
const unaryRequestPayload = { id: 1, name: 'Foo' };
client.unary(unaryRequestPayload, (error, response) => {

  if (error) {
    console.error(error);
    return;
  }

  console.log(`[Unary] Call result: ${JSON.stringify(response)}`);
});

/**
 * 
 * Streaming call
 * With single requests and multiple responses
 */
const streamingRequestPayload = { id: 1, name: 'Foo' };
const call = client.single(streamingRequestPayload);

call.on('data', (streamingResponse) => {
  console.log('[Single] Server Streaming Response:', streamingResponse);
});

call.on('end', () => {
  console.log('[Single] Server Streaming RPC Ended');
});

call.on('error', (error) => {
  console.error('[Single] Server Streaming Error:', error);
});

call.on('status', (status) => {
  console.log('[Single] Server Streaming RPC Status:', status);
});


/**
 * 
 * Streaming call
 * With multiple requests and multiple responses
 */
const multiplePayloadStreamingRequest = [
  { id: 1, name: 'Foo' },
  { id: 2, name: 'Bar' },
  { id: 3, name: 'Baz' },
]
const stream = client.multiple();

multiplePayloadStreamingRequest.forEach((request) => {
  stream.write(request);
});

stream.end();

stream.on('data', (response) => {
  console.log('[Multiple] Server Streaming Response:', response);
});

stream.on('end', () => {
  console.log('[Multiple] Server Streaming RPC Ended');
});

stream.on('error', (error) => {
  console.error('[Multiple] Server Streaming Error:', error);
});

/**
 * 
 * Server bootstrap with express
 */
app.listen(8080, () => {
  console.log('Client server listening on port 8080');
});
