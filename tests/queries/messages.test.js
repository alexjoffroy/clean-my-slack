const sinon = require('sinon')
const {expect} = require('../helpers/chai')
const {relative} = require('../helpers/path')
const Slack = require('../../src/slack')
const Messages = require('../../src/queries/messages')

const dataset = [
    {ts: '123456', text: 'Message A'},
    {ts: '789123', text: 'Message B'},
]

describe(relative(__filename), async () => {
    beforeEach(() => {
        let messages = Array.from(dataset)
        
        slack = sinon.createStubInstance(Slack)

        slack.client = {
            conversations: {
                history: function({limit}) {
                    const requestedMessages = messages.splice(0, limit)
                    
                    return {
                        has_more: messages.length > 0,
                        messages: requestedMessages
                    }
                }
            }
        }
    })

    it('sets limit', async () => {
        let query = new Messages({slack}).setLimit(3)

        expect(query).to.be.an.instanceOf(Messages)
        expect(query.limit).to.equals(3)
    })

    it('filters by channel', async () => {
        let query = new Messages({slack}).whereChannel({id: 123})

        expect(query).to.be.an.instanceOf(Messages)
        expect(query.channel).to.be.an.instanceOf(Object).that.deep.equals({id: 123})
    })

    it('gets messages but has more', async () => {
        let query = new Messages({slack}).setLimit(1).whereChannel({id: 123})
        let messages = await query.get()

        expect(messages).to.be.an.instanceOf(Array)
        expect(messages.length).to.equals(1)
        expect(messages[0]).to.deep.equals(dataset[0])
        expect(query.hasMore).to.equals(true)
    })

    it('gets messages and has no more', async () => {
        let query = new Messages({slack}).setLimit(3).whereChannel({id: 123})
        let messages = await query.get()

        expect(messages).to.be.an.instanceOf(Array)
        expect(messages.length).to.equals(2)
        expect(messages[0]).to.deep.equals(dataset[0])
        expect(messages[1]).to.deep.equals(dataset[1])
        expect(query.hasMore).to.equals(false)
    })
})