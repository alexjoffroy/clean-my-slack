
const sinon = require('sinon')
const {expect} = require('./helpers/chai')
const {relative} = require('./helpers/path')
const {Command} = require('commander')
const App = require('../src/app');

class TestCommand {
    run() {}
}
TestCommand.command = 'test:command',
TestCommand.description = 'Test description',
TestCommand.options = [{ flag: '-T', description: 'Test flag' }],

describe(relative(__filename), () => {
    
    let app;
    let commander;
    
    function runApp(app, command = '', args = []) { 
        app.run(['node','./bin/run', command].concat(args))
    }

    beforeEach(() => {
        commander = new Command

        sinon.spy(commander, 'command')
        sinon.spy(Command.prototype, 'description')
        sinon.spy(Command.prototype, 'option')
        sinon.spy(Command.prototype, 'parse')
        sinon.spy(Command.prototype, 'version')
        sinon.spy(TestCommand.prototype, 'run')

        app = new App().registerCommander(commander);
    })

    it('sets the correct version', () => {
        runApp(app)
        expect(commander.version).to.have.been.calledOnceWith(require('../package.json').version)
    })

    it('registers a command', () => {
        app.registerCommand(TestCommand)
        runApp(app)

        expect(commander.command).to.have.been.calledWith(TestCommand.command)
        expect(commander.description).to.have.been.calledWith(TestCommand.description)

        TestCommand.options.forEach((option) => {
            expect(commander.option).to.have.been.calledWith(option.flag, option.description)
        })
    })

    it('parses the cli arguments', () => {
        runApp(app)
        expect(commander.parse).to.have.been.calledOnce
    })

    it('runs the requested command', () => {
        app.registerCommand(TestCommand)

        runApp(app, 'test:command', ['-T', '1234']);

        expect(TestCommand.prototype.run).to.have.been.calledOnce
    })
    
    afterEach(() => {
        commander.command.restore()
        Command.prototype.description.restore()
        Command.prototype.option.restore()
        Command.prototype.parse.restore()
        Command.prototype.version.restore()
        TestCommand.prototype.run.restore()
        app = commander = null;
    })
})