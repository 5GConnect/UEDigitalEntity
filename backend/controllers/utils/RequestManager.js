const axios = require('axios');
const errorHandler = require('../handler/ErrorHandler')

module.exports.makeARequest = (method, requestPath, onSuccess) => {
    return new Promise((resolve, reject) => {
        axios({
                method: method,
                url: requestPath,
            })
            .then(response => {
                resolve(onSuccess(response.data))
            })
            .catch(error => {
                reject(errorHandler.handleError(error))
            })
    });
}

module.exports.makeARequestWithBodyData = (method, requestPath, data, onSuccess) => {
    return new Promise((resolve, reject) => {
        axios({
                method: method,
                url: requestPath,
                data: data
            })
            .then(response => {
                resolve(onSuccess(response.data))
            })
            .catch(error => {
                reject(errorHandler.handleError(error))
            })
    });
}