import winston from 'winston';
export default class LoggerService {
    constructor(env) {
        this.options = {
            levels: {
                fatal: 0,
                error: 1,
                warning: 2,
                info: 3,
                http: 4,
                debug: 5,
            },
            colors: {
                fatal: "bold inverse red",
                error: "red",
                warning: "yellow",
                info: "blue",
                http: "white",
                debug: "green"
            }
        };
        this.logger = this.createLogger(env);
    }

    createLogger = (env) => {
        switch (env) {
            case "dev":
                return winston.createLogger({
                    levels: this.options.levels,
                    transports: [
                        new winston.transports.Console({
                            level: "debug", format: winston.format.combine(winston.format.colorize({ colors: this.options.colors }), winston.format.simple()),
                        })
                    ]
                })
            case "prod":
                return winston.createLogger({
                    levels: this.options.levels,
                    transports: [
                        new winston.transports.Console({
                            level: "info", format: winston.format.combine(winston.format.colorize({ colors: this.options.colors }), winston.format.simple())
                        }),
                        new winston.transports.File({ level: "error", format: winston.format.simple(), filename: './errors.log' })
                    ]
                })
        }
    }
}