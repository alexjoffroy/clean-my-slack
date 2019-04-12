const {expect} = require('../helpers/chai')
const {relative} = require('../helpers/path')
const Queries = require('../../src/queries')
const Channels = require('../../src/queries/channels')
const Messages = require('../../src/queries/messages')

describe(relative(__filename), async () => {

    let queries;
    
    before(() => {
        queries = new Queries({})
    })

    it('makes a channels query', async () => {
        expect(queries.make('channels')).to.be.an.instanceOf(Channels)
    })

    it('makes a messages query', async () => {
        expect(queries.make('messages')).to.be.an.instanceOf(Messages)
    })
    
})