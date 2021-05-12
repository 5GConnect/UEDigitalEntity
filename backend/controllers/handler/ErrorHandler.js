const logger = require('../../utils/logger');
module.exports.handleError = (error) => {
    logger.log(error)
    return "Generic-error"
}
