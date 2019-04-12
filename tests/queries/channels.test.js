const sinon = require('sinon')
const {expect} = require('../helpers/chai')
const {relative} = require('../helpers/path')
const Slack = require('../../src/slack')
const Channels = require('../../src/queries/channels')

const response = {
    channels: [
        {id: 123, name: 'channel-a'},
        {id: 456, name: 'channel-b'},
    ]
}

describe(relative(__filename), async () => {
    beforeEach(() => {
        slack = sinon.createStubInstance(Slack)

        slack.client = {
            conversations: {
                list: function() {
                    return response
                }
            }
        }
    })

    it('gets channels', async () => {
        let channels = await new Channels({slack}).get()

        expect(channels).to.be.an.instanceOf(Array)
        expect(channels.length).to.equals(2)
        expect(channels).to.include.members(response.channels)
    })

    it('find channel by name', async () => {
        let channel = await new Channels({slack}).findByName('channel-a')

        expect(channel).to.be.an.instanceOf(Object).that.deep.equals({id: 123, name: 'channel-a'})
    })

    it('returns null when trying to find an unknow channel', async () => {
        let channel = await new Channels({slack}).findByName('channel-c')

        expect(channel).to.be.null
    })
})