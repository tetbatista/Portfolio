import nodemailer from 'nodemailer'
    
export async function getMailClient() {
    const account = await nodemailer.createTestAccount()

    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
            user: account.user,
            pass: account.pass,
        },
        tls: {
            rejectUnauthorized: false,
            minVersion: 'TLSv1.2' // Garantir que está usando uma versão segura do TLS
        }
    })

    // Verificar a conexão com o servidor SMTP
    transporter.verify((error, success) => {
        if (error) {
            console.log('SMTP connection error:', error)
        } else {
            console.log('SMTP server is ready to take our messages')
        }
    })

    return transporter
}