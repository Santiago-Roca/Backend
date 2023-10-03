import LoggerService from "../services/LoggerService.js";

const logger = new LoggerService("dev")

const attachLogger = (req,res,next) =>{
    req.logger = logger.logger;
    next();
}

export default attachLogger;