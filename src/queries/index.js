const definitions = { 
    channels: require('./channels'), 
    messages: require('./messages') 
}

module.exports = class Queries {
    constructor(slack) {
        this.slack = slack
    }

    make(name) {
        return new definitions[name]({slack: this.slack})
    }
}