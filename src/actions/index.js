const definitions = { 
    'delete-messages': require('./delete-messages')
}

module.exports = class Actions {
    constructor(slack) {
        this.slack = slack
    }

    make(name) {
        return new definitions[name]({slack: this.slack})
    }
}