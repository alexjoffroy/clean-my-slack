const {relative} = require('path')

module.exports = {
    relative(filename) {
        return relative(process.cwd(), filename)
    }
}