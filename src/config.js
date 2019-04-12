const Configstore = require('configstore')

class Config {
    constructor() {
        this.store = new Configstore('clean-my-slack', {workspaces: []}, { globalConfigPath: true })
    }

    getWorkspaces() {
        return this.store.get('workspaces')
    }

    getWorkspace(name) {
        let filter = this.getWorkspaces().filter(workspace => workspace.name === name)

        return filter.length ? filter[0] : null
    }

    addWorkspace(name, token) {
        let workspaces = this.getWorkspaces()

        workspaces.push({name, token})
        
        this.store.set('workspaces', workspaces)
    }
}

module.exports = Config