import { PrismaClient } from "@prisma/client"

export const prisma = new PrismaClient({
    log: ['query'], //Sempre que fizermos uma query no banco de dados, ele vai mostrar no log do servidor
})