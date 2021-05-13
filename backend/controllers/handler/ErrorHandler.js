const logger = require('../../utils/logger');
module.exports.handleError = (error) => {
    logger.error(error)
    return "Generic-error"
}
