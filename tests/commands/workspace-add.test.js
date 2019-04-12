const sinon = require('sinon')
const {expect} = require('../helpers/chai')
const {relative} = require('../helpers/path')
const {WorkspaceAdd} = require('../../src/commands')
const App = require('../../src/app')
const Config = require('../../src/config')
const Printer = require('../../src/printer')
const Slack = require('../../src/slack')

describe(relative(__filename), () => {

    let app, config, printer, slack;
    
    beforeEach(() => {
        app = sinon.createStubInstance(App)
        config = sinon.createStubInstance(Config)
        printer = sinon.createStubInstance(Printer)
        slack = sinon.createStubInstance(Slack)

        slack.checkToken = async function(token) {
            if (token !== 'valid_token') {
                throw new Error('invalid_token')
            }
        }

        app.config = config
        app.printer = printer
        app.slack = slack
    })

    it('prints an error when running without name provided', async () => {
        await new WorkspaceAdd(app).run({})

        expect(printer.error).to.be.calledWith('Please provide a name.')
    })

    it('prints an error when running without token provided', async () => {
        await new WorkspaceAdd(app).run({name: 'my_workspace'})

        expect(printer.error).to.be.calledWith('Please provide a token.')
    })

    it('prints an error when running without a valid token provided', async () => {        
        await new WorkspaceAdd(app).run({name: 'my_workspace', token: 'invalid_token'})

        expect(printer.error).to.be.calledWith('Please provide a valid token.')
    })

    it('adds the workspace to config storage', async () => {
        await new WorkspaceAdd(app).run({name: 'my_workspace', token: 'valid_token'})

        expect(config.addWorkspace).to.have.been.calledOnceWith('my_workspace', 'valid_token')
        expect(printer.success).to.be.calledWith('Succesfully register workspace.')
    })
    
})