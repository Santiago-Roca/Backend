import nodemailer from 'nodemailer';
import config from '../config/config.js';
import DMailInfo from '../constant/DMailInfo.js';
import { generateMailTemplate } from '../utils.js';

export default class MailingService {
    constructor() {
        this.mailer = nodemailer.createTransport({
            service:'gmail',
            port:587,
            auth:{
                user: config.mailer.USER,
                pass: config.mailer.PASSWORD
            }
        })
    }

    sendMail = async(emails,template,payload) => {
        const mailInfo = DMailInfo[template];
        const html = await generateMailTemplate(template,payload);
        const result = await this.mailer.sendMail({
            from: 'Ecommerce - ERP <santiroca88@gmail.com>',
            to: emails,
            html,
            ...mailInfo
        })
        return result;
    }
}