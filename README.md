<p align='center'>
    <img src='https://grpc.io/img/logos/grpc-logo.png' width='200' alt='Logo'>
</p>

```
gRPC example made to understand better how it works with nodejs
```

# Overview
gRPC, which stands for "Remote Procedure Call" is an open-source framework developed by Google. It's designed for building efficient and reliable communication between distributed systems.

In gRPC, a client application can directly call a method on a server application on a different machine as if it were a local object, making it easier for you to create distributed applications and services. As in many RPC systems, gRPC is based around the idea of defining a service, specifying the methods that can be called remotely with their parameters and return types. On the server side, the server implements this interface and runs a gRPC server to handle client calls. On the client side, the client has a stub (referred to as just a client in some languages) that provides the same methods as the server.

<p align='center'>
    <img src='https://grpc.io/img/landing-2.svg' width='500' alt='Example'>
</p>


# Sources

- https://grpc.io
- https://docs.nestjs.com/microservices/grpc