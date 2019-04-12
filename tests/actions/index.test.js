const {expect} = require('../helpers/chai')
const {relative} = require('../helpers/path')
const Actions = require('../../src/actions')
const DeleteMessages = require('../../src/actions/delete-messages')

describe(relative(__filename), async () => {

    let actions;
    
    before(() => {
        actions = new Actions({})
    })

    it('makes a delete-messages query', async () => {
        expect(actions.make('delete-messages')).to.be.an.instanceOf(DeleteMessages)
    })
    
})