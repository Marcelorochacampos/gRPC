const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const PROTO_PATH = __dirname + '/hero.proto';

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
 * Server declaration
 */
const server = new grpc.Server();


/**
 * 
 * Unary method handler
 */
const unary = async (call, callback) => {
	console.log('[Unary] Handling request')
	const request = call.request;
	const response = { id: request.id, status: 'SUCCESS' }; // Adjust the response based on your requirements
	callback(null, response);
}

/**
 * 
 * Single streaming method handler
 */
const single = async (call) => {
	const request = call.request;
	console.log(`[Single] Handling request (${JSON.stringify(request)})`)
	/**
	 * 
	 * Send multiple responses
	 */
	for (let i = 0; i < 2; i++) {
		const response = { id: i, status: `Response ${i} to id ${request.id}` };
		call.write(response);
	}

	/**
	 * 
	 * Signal the end of the stream
	 */
	call.end();
}

const multiple = async (call) => {
	call.on('data', (request) => {
    console.log(`[Multiple] Handling request ${JSON.stringify(request)}`);

		for (let i = 0; i < 2; i++) {
			const response = { id: i, status: `Response ${i} to id ${request.id}` };
			call.write(response);
		}
  });

  call.on('end', () => {
    console.log('[Multiple] Server Streaming RPC Ended');
    call.end();
  });

  call.on('error', (error) => {
    console.error('[Multiple] Server Streaming Error:', error);
  });
}

/**
 * 
 * Services
 */
server.addService(HeroServiceProto.service, { unary, single, multiple });

const port = 50051;
const bindAddress = '0.0.0.0:' + port;

server.bindAsync(bindAddress, grpc.ServerCredentials.createInsecure(), (err, port) => {
	if (err) {
		console.error(`Error starting server: ${err}`);
	} else {
		console.log(`Server is listening on ${bindAddress}`);
		server.start();
	}
});
