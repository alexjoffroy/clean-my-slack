module.exports = class Channels {
    constructor(options) {
        this.slack = options.slack
        this.types = 'public_channel,private_channel'
    }
    
    async findByName(name) {
        const channels = (await this.get()).filter(channel => channel.name === name)

        return channels.length ? channels[0] : null
    }

    async get() {
        let response = await this.slack.client.conversations.list({
            types: this.types
        })

        return response.channels
    }
}