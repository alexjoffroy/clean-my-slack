class WorkspaceAdd {
    
    constructor(app) {
        this.config = app.config
        this.slack = app.slack
        this.printer = app.printer
    }
    
    async run(command) {        
        if (!command.name) {
            return this.printer.error('Please provide a name.')
        }

        if (!command.token) {
            return this.printer.error('Please provide a token.')
        }

        try {
            await this.slack.checkToken(command.token)
        } catch (err) {
            return this.printer.error('Please provide a valid token.')
        }

        this.config.addWorkspace(command.name, command.token)

        this.printer.success('Succesfully register workspace.')
    }
}

WorkspaceAdd.command = 'workspace:add';

WorkspaceAdd.description = "register a new token";

WorkspaceAdd.options = [
    { flag: '-n, --name <name>', description: 'workspace name to register' },
    { flag: '-t, --token <token>', description: 'token to register' }
];

module.exports = WorkspaceAdd
