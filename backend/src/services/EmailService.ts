//external dependencies
import nodemailer, {Transporter} from 'nodemailer';
import handlebars from 'handlebars';
import fs from 'fs/promises';

//internal dependencies
import Utils from '../utils/Utils';

interface emailAccount {
    emailAddress: string
    emailPassword: string
    host: string
    port: number
    secure: boolean
}

class EmailService {
    //TEMP: use an instance of this class instead of static methods
    private initialized: Promise<void>
    private account: emailAccount | null = null
    private transporter: Transporter | null = null

    constructor() {
        this.initialized = this.initialize();
    }

    private async initialize(): Promise<void> {
        await this.setAccount();
        this.setTransporter();
    } 

    async setAccount(): Promise<void> {
        //TEMP: use Ethereal Email to test in dev env
        const etherealAccount = await nodemailer.createTestAccount();
        
        this.account = {
            emailAddress: etherealAccount.user,
            emailPassword: etherealAccount.pass,
            host: etherealAccount.smtp.host,
            port: etherealAccount.smtp.port,
            secure: etherealAccount.smtp.secure
        }
    }

    setTransporter() {
        if (this.account) {
            //TEMP: configure SSL certificates
            this.transporter = nodemailer.createTransport({
                host: this.account.host,
                port: this.account.port,
                secure: this.account.secure,
                auth: {
                    user: this.account.emailAddress,
                    pass: this.account.emailPassword
                },
                tls: {
                    rejectUnauthorized: false
                }
            }) as Transporter
        }
    }

    async sendVerificationEmail(companyId: string, userId: string, email: string, name: string) {
        //await async initialization
        await this.initialized;

        try {
            // Read the email template
            const source = await fs.readFile('./src/files/EmailTemplates/EmailVerification.hbs', 'utf8');
            const template = handlebars.compile(source);

            // Compile the email template with dynamic data
            //TEMP: use a JWT token in the verification link
            const params = new URLSearchParams();
            params.append('token', this.getVerificationToken(companyId, userId, email));
            const verificationLink = `${process.env.FRONTEND_SERVER_ADDRESS}/verifyEmail?` + params.toString();
            const html = template({ name, verificationLink });

            if (!this.transporter) {
                //TEMP: handle this error
                throw new Error('Email transporter not initialized')
            }

            // Send the email
            const result = await this.transporter.sendMail({
                from: process.env.EMAIL_ADDRESS,
                to: email,
                subject: 'Email Verification',
                html: html
            });

            console.log('Email results:');
            console.log('Email sent:', result.response);
            console.log('Preview URL:', nodemailer.getTestMessageUrl(result));
        } catch (error) {
            //TEMP: handle this error
            throw error;
        }
    }

    getVerificationToken(companyId: string, userId: string, email: string) {
        const payload = {
            id: companyId,
            userId: userId,
            email: email
        }

        return Utils.generateJWT(payload, process.env.JWT_EMAIL_VERIFICATION_EXPIRES_IN as string, process.env.JWT_PRIVATE_KEY_EMAIL_VERIFICATION as string);
    }

    async sendResetPasswordEmail(userId: string, token: string, email: string) {
        //await async initialization
        await this.initialized;

        try {
            // Read the email template
            const source = await fs.readFile('./src/files/EmailTemplates/ResetPassword.hbs', 'utf8');
            const template = handlebars.compile(source);

            // Compile the email template with dynamic data
            //TEMP: use a JWT token in the verification link
            const params = new URLSearchParams();
            params.append('token', token);
            params.append('userId', userId);
            const resetPasswordLink = `${process.env.FRONTEND_SERVER_ADDRESS}/resetPassword?` + params.toString();
            const html = template({ resetPasswordLink });

            if (!this.transporter) {
                //TEMP: handle this error
                throw new Error('Email transporter not initialized')
            }

            // Send the email
            const result = await this.transporter.sendMail({
                from: process.env.EMAIL_ADDRESS,
                to: email,
                subject: 'Reset password',
                html: html
            });

            console.log('Email results:');
            console.log('Email sent:', result.response);
            console.log('Preview URL:', nodemailer.getTestMessageUrl(result));
        } catch (error) {
            //TEMP: handle this error
            throw error;
        }
    }
}

export default EmailService;