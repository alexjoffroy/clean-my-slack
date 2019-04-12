class Logger {

    constructor(chalk) {
        this.chalk = chalk
    }
    
    info(message) {
        console.log(message)
    }
    
    success(message) {
        console.log(this.chalk.green(message))
    }

    error(message) {
        console.log(this.chalk.red(message))
    }
}

module.exports = Logger