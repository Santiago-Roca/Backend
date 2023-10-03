//ERROR HANDLER
export default (error, req, res, next) => {
    req.logger.error(error);
    res.status(error.status).send({ status: "error", error: error.message })
}