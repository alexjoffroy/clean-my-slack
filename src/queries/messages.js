module.exports = class Messages {
    constructor(options) {
        this.slack = options.slack
        this.hasMore = true
        this.channel = null
        this.limit = 100
    }

    setLimit(limit) {
        this.limit = limit

        return this
    }
    
    whereChannel(channel) {
        this.channel = channel;

        return this
    }

    async get() {
        let response = await this.slack.client.conversations.history({
            channel: this.channel.id,
            limit: this.limit
        })

        this.hasMore = response.has_more

        return response.messages
    }
}