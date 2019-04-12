class Clean {
    constructor(app) {
        this.config = app.config
        this.printer = app.printer
        this.slack = app.slack
        this.actions = app.actions
        this.queries = app.queries
    }

    async run(command) {
        let workspace = this.config.getWorkspace(command.workspace)

        if (!workspace) {
            this.printer.error('Please provide an existing workspace.')
            return this.printer.info('Existing workspaces are: ' + this.config.getWorkspaces().map(workspace => `"${workspace.name}"`).join(', ') + '.')
        }

        if (!command.channel) {
            return this.printer.error('Please provide a channel.')
        }

        this.slack.setToken(workspace.token)

        let query = this.queries.make('channels')
        let channel = await query.findByName(command.channel)

        if (!channel) {
            this.printer.error('Please provide an existing channel.')
            return this.printer.info('Existing channels are: ' + (await query.get()).map(channel => `"${channel.name}"`).join(', ') + '.')
        }

        query = this.queries.make('messages').whereChannel(channel)

        let action = this.actions.make('delete-messages')
        while (query.hasMore) {
            let messages = await query.get()
            await action.run(channel, messages, (message) => this.printer.success(`Message "${message.text} (ts: ${message.ts})" deleted.`))
        }
    }
}

Clean.command = 'clean';

Clean.description = "clean a channel";

Clean.options = [
    { flag: '-w, --workspace <workspace>', description: 'workspace name' },
    { flag: '-c, --channel <channel>', description: 'channel name' },
];

module.exports = Clean