
const Configstore = require('configstore').prototype
const sinon = require('sinon')
const {expect} = require('./helpers/chai')
const {relative} = require('./helpers/path')
const Config = require('../src/config')

describe(relative(__filename), () => {

    beforeEach(() => {
        sinon.stub(Configstore, 'get').callsFake((key) => key === 'workspaces' ? [{name: 'my_workspace', token: 'a_valid_token'}] : null)
        sinon.stub(Configstore, 'set')
    })

    afterEach(() => {
        Configstore.get.restore()
        Configstore.set.restore()
    })

    it('gets a workspace', () => {
        let workspace = new Config().getWorkspace('my_workspace')

        expect(Configstore.get).to.have.been.calledOnceWith('workspaces')
        expect(workspace).to.deep.equals({name: 'my_workspace', token: 'a_valid_token'})
    })

    it('gets null when workspace is not found', () => {
        let workspace = new Config().getWorkspace('unknown')

        expect(Configstore.get).to.have.been.calledOnceWith('workspaces')
        expect(workspace).to.be.null
    })
    
    it('adds a workspace', () => {
        new Config().addWorkspace('my_workspace_2', 'a_valid_token')

        expect(Configstore.set).to.have.been.calledOnceWith('workspaces', [
            {name: 'my_workspace', token: 'a_valid_token'}, 
            {name: 'my_workspace_2', token: 'a_valid_token'}
        ])
    })

})