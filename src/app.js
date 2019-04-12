const version = require('../package.json').version;
const { WebClient } = require('@slack/client')
const chalk = require('chalk')
const Config = require('./config')
const Printer = require('./printer')
const Slack = require('./slack')
const Actions = require('./actions')
const Queries = require('./queries')

class App {

    constructor() {
        this.commander = null;
        this.commands = []
        this.config = new Config;
        this.printer = new Printer(chalk);
        this.slack = new Slack(new WebClient())
        this.actions = new Actions(this.slack)
        this.queries = new Queries(this.slack)
    }

    registerCommander(commander) {
        this.commander = commander

        return this
    }

    registerCommand(command) {
        this.commands.push(command)

        return this
    }
    
    async run(argv) {
        this.commander.version(version)
        
        this.commands.map((definition) => {
            let command = this.commander.command(definition.command) 
            
            command.description(definition.description)
        
            definition.options.map((option) => {
                command.option(option.flag, option.description)
            })
        
            command.action((command) => { 
                (new definition(this)).run(command)
            });
        })

        this.commander.parse(argv);

        return this
    }
}

module.exports = App;