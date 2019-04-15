const sinon = require('sinon')
const {expect} = require('../helpers/chai')
const {relative} = require('../helpers/path')
const Slack = require('../../src/slack')
const DeleteMessages = require('../../src/actions/delete-messages')

describe(relative(__filename), async () => {
    before(() => {
        slack = sinon.createStubInstance(Slack)

        slack.client = {
            chat: {
                delete: sinon.spy()
            }
        }
    })

    it('deletes messages', async () => {
        const channel = {id: 1}
        const messages = [
            {ts: '123456', text: 'Message A'},
            {ts: '789123', text: 'Message B'},
        ]
        const progress = sinon.spy()
        
        let action = new DeleteMessages({slack})
        
        await action.run(channel, Array.from(messages), progress)

        expect(slack.client.chat.delete).to.have.been.calledWith({channel: channel.id, ts: messages[0].ts})
        expect(progress).to.have.been.calledWith(messages[0])
        expect(slack.client.chat.delete).to.have.been.calledWith({channel: channel.id, ts: messages[1].ts})
        expect(progress).to.have.been.calledWith(messages[1])
        expect(slack.client.chat.delete).to.have.been.calledTwice
        expect(progress).to.have.been.calledTwice
    })
})