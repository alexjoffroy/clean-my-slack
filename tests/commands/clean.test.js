const sinon = require('sinon')
const {expect} = require('../helpers/chai')
const {relative} = require('../helpers/path')
const App = require('../../src/app')
const Config = require('../../src/config')
const Slack = require('../../src/slack')
const Printer = require('../../src/printer')
const {Clean} = require('../../src/commands')
const Channels = require('../../src/queries/channels')
const Messages = require('../../src/queries/messages')
const DeleteMessages = require('../../src/actions/delete-messages')

const workspaces = [
    {name: 'my_workspace', token: 'my_token'},
    {name: 'my_workspace_2', token: 'my_token_2'},
]

const channels = [
    {id: 1, name: 'channel-a'},
    {id: 2, name: 'channel-b'},
]

const messages = [
    {ts: '123456', text: 'Message A'},
    {ts: '789123', text: 'Message B'},
]

const queryStubs = {
    channels: sinon.createStubInstance(Channels, {
        findByName: sinon.stub().callsFake((name) => {
            let filter = channels.filter(channel => channel.name === name)
            return filter.length ? filter[0]: null
        }),
        get: sinon.stub().callsFake(() => {
            return channels
        })
    }),
    messages: sinon.createStubInstance(Messages, {
        whereChannel: sinon.stub().returnsThis(),
        get: sinon.stub().callsFake(() => {
            queryStubs.messages.hasMore = false
            return messages
        })
    })
}

queryStubs.messages.hasMore = true

const actionStubs = {
    'delete-messages': sinon.createStubInstance(DeleteMessages, {
        run: sinon.stub().callsFake((channel, messages, progress) => {
            messages.map(progress)
        })
    }),
}

describe(relative(__filename), async () => {
    let app, printer
    
    beforeEach(() => {
        app = sinon.createStubInstance(App)
        printer = sinon.createStubInstance(Printer)

        app.config = sinon.createStubInstance(Config, {
            getWorkspaces: sinon.stub().returns(workspaces),
            getWorkspace: sinon.stub().callsFake((name) => {
                let filter = workspaces.filter(workspace => workspace.name === name)
                return filter.length ? filter[0]: null
            })
        })

        app.slack = sinon.createStubInstance(Slack)

        app.actions = {
            make(action) {
                return actionStubs[action]
            }
        }

        app.queries = {
            make(query) {
                return queryStubs[query]
            }
        }

        app.printer = printer
    })

    it('prints an error when running without workspace provided', async () => {
        await new Clean(app).run({})

        expect(printer.error).to.be.calledWith('Please provide an existing workspace.')
        expect(printer.info).to.be.calledWith('Existing workspaces are: "my_workspace", "my_workspace_2".')
    })

    it('prints an error when running without an existing workspace provided', async () => {        
        await new Clean(app).run({workspace: 'unknown' })

        expect(printer.error).to.be.calledWith('Please provide an existing workspace.')
        expect(printer.info).to.be.calledWith('Existing workspaces are: "my_workspace", "my_workspace_2".')        
    })

    it('prints an error when running without channel provided', async () => {
        await new Clean(app).run({workspace: 'my_workspace' })

        expect(queryStubs.channels.get.notCalled)
        expect(printer.error).to.be.calledWith('Please provide a channel.')
    })

    it('prints an error when running without an existing channel provided', async () => {        
        await new Clean(app).run({workspace: 'my_workspace', channel: 'unknown'})

        expect(queryStubs.channels.findByName.calledWith('unknown'))
        expect(queryStubs.channels.get.called)
        expect(printer.error).to.be.calledWith('Please provide an existing channel.')
        expect(printer.info).to.be.calledWith('Existing channels are: "channel-a", "channel-b".')
    })

    it('cleans provided channel', async () => {
        await new Clean(app).run({workspace: 'my_workspace', channel: 'channel-a'})

        expect(actionStubs['delete-messages'].run).to.be.calledOnceWith(channels[0], messages)
        expect(printer.success).to.be.calledWith(`Message "${messages[0].text} (ts: ${messages[0].ts})" deleted.`)
        expect(printer.success).to.be.calledWith(`Message "${messages[1].text} (ts: ${messages[1].ts})" deleted.`)
    });
})