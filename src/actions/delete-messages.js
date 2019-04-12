module.exports = class DeleteMessages {
    constructor(options) {
        this.slack = options.slack
        // Delay to avoid Slack throttle 
        this.throttle = 1000
    }

    async run(channel, messages, progress) {
        const message = messages.shift();

        if (message) {
          await this.slack.client.chat.delete({ channel: channel.id, ts: message.ts });
          
          progress(message)

          return new Promise(resolve => {
            setTimeout(async () => {
              await this.run(channel, messages, progress);
              resolve();
            }, this.throttle);
          });
        }
    }
}