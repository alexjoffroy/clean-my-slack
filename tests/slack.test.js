
const { WebClient } = require('@slack/client')
const sinon = require('sinon')
const {expect} = require('./helpers/chai')
const {relative} = require('./helpers/path')
const Slack = require('../src/slack')

describe(relative(__filename), () => {
    
    let clientStub;
    
    before(() => {
        sinon.stub(WebClient.prototype, 'apiCall').callsFake(async function() {
            if (this.token === 'VALID_TOKEN') {
                return {ok: true}
            } else {
                throw new Error('invalid_token')
            }
        })

        clientStub = new WebClient
    })

    after(() => {
        WebClient.prototype.apiCall.restore()
    })
    
    it('checks a token is invalid', async () => {
        let error
        
        try {
            await new Slack(clientStub).checkToken('INVALID_TOKEN')
        } catch(err) {
            error = err
        }
        
        expect(error).to.be.a('Error')
        expect(error.message).to.equals('invalid_token')
    })
    
    it('checks a token is valid', async () => {
        let error
        
        try {
            await new Slack(clientStub).checkToken('VALID_TOKEN')
        } catch(err) {
            error = err
        }

        expect(error).to.be.undefined
    })

    it('provides a slack/client instance', async () => {
        const client = new Slack(clientStub).client

        expect(client).to.be.an.instanceOf(WebClient)
    })

    it('sets the token', async () => {
        const client = new Slack(clientStub).setToken('my_token').client

        expect(client.token).to.be.equals('my_token')
    })

})