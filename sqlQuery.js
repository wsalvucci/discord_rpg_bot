con = require('./database')

module.exports = function(query, parameters) {
    return new Promise(function(resolve, reject) {
        con.query(query, parameters, function(err, result) {
            if (err) reject(err)
            resolve(result)
        })
    })
}