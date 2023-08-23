import __dirname from '../utils.js'
export default {
    welcome: {
        subject: "¡Bienvenido!",
        attachments: [
            {
                filename: 'banner.jpg',
                path: `${__dirname}/public/images/erp2.jpg`,
                cid: "banner"
            }
        ]
    },
    restore: {
        subject:"Restaurar contraseña",
        attachments: [
            {
                filename:'banner.png',
                path:`${__dirname}/public/images/erp2.jpg`,
                cid:"banner"
            }
        ]
    }
}