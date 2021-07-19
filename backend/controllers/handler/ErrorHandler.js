const logger = require('../../utils/logger');
module.exports.handleError = (error) => {
    logger.error(error)
    if (error.response.data) {
        return {
            status: error.response.status ? error.response.status : '501',
            message: error.response.data
        }
    }
    return {
        message: 'Generic-error'
    }
}