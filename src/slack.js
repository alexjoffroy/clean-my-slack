class Slack {
    constructor(client) {
        this.client = client
    }

    async checkToken(token) {
        this.client.token = token;

        return await this.client.auth.test()
    }

    setToken(token) {
        this.client.token = token

        return this
    }
}

module.exports = Slack