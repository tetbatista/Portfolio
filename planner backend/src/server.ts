import fastify from "fastify";
import { prisma } from "./lib/prisma";
import cors from '@fastify/cors'
import { createTrip } from "./routes/create-trip";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { confirmTrip } from "./routes/confirm-trip";
import { confirmParticipants } from "./routes/confirm-participant";

const app = fastify()

app.register(cors, {
    origin: '*',
    
})

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createTrip)
app.register(confirmTrip)
app.register(confirmParticipants)

app.listen({ port: 3003 }).then(() => {
    console.log('Server running!')
})