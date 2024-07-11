//create-trip.ts

import { FastifyInstance } from "fastify"
import { ZodTypeProvider } from "fastify-type-provider-zod"
import nodemailer from 'nodemailer'
import { z } from 'zod'
import { prisma } from "../lib/prisma"
import { getMailClient } from "../lib/mail"
import { dayjs } from '../lib/dayjs'

export async function createTrip(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post('/trips', {
        schema: {
            body: z.object({
                destination: z.string().min(4),
                starts_at: z.coerce.date(),
                ends_at: z.coerce.date(),
                owner_name: z.string(),
                owner_email: z.string().email(),
                emails_to_invite: z.array(z.string().email()),
            })
        },
    }, async (request, reply) => {
        const {destination, starts_at, ends_at, owner_name, owner_email, emails_to_invite} = request.body
        
        if (dayjs(starts_at).isBefore(new Date())) {
            throw new Error('Invalid strip start date.')
        }

        if (dayjs(ends_at).isBefore(starts_at)) {
            throw new Error('Invalid strip end date.')
        }

        const trip = await prisma.trip.create({
            data: {
                destination,
                starts_at,
                ends_at,
                participants: {
                   createMany: {
                       data: [
                        {
                            name: owner_name,
                            email: owner_email,
                            is_owner: true,
                            is_confirmed: true,
                        },
                        ...emails_to_invite.map(email => {
                            return { email }
                        })
                       ],
                    }
                }
            }
        })

           
        return { tripId: trip.id }
    })
}