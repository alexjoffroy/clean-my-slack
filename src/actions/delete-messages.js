module.exports = class DeleteMessages {
    constructor(options) {
        this.slack = options.slack
    }

    async run(channel, messages, progress) {
        const message = messages.shift();

        if (message) {
          await this.slack.client.chat.delete({ channel: channel.id, ts: message.ts });
          
          progress(message)

          await this.run(channel, messages, progress);
        }
    }
}