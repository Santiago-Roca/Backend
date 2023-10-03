import __dirname from '../utils.js'
export default {
    welcome: {
        subject: "¡Bienvenido!",
        attachments: [
            {
                filename: 'banner.jpg',
                path: `${__dirname}/public/images/pic.jpg`,
                cid: "banner"
            }
        ]
    },
    delete: {
        subject: "¡Cuenta Eliminada!",
        attachments: [
            {
                filename: 'banner.jpg',
                path: `${__dirname}/public/images/pic.jpg`,
                cid: "banner"
            }
        ]
    },
    restore: {
        subject: "Restaurar contraseña",
        attachments: [
            {
                filename: 'banner.png',
                path: `${__dirname}/public/images/pic.jpg`,
                cid: "banner"
            }
        ]
    },
    purchase: {
        subject: "Compra Exitosa",
        attachments: [
            {
                filename: 'banner.png',
                path: `${__dirname}/public/images/pic.jpg`,
                cid: "banner"
            }
        ]
    },
    productDeleted: {
        subject: "Producto Eliminado",
        attachments: [
            {
                filename: 'banner.png',
                path: `${__dirname}/public/images/pic.jpg`,
                cid: "banner"
            }
        ]
    }
}