# clean-my-slack

CLI tool to easily batch delete messages from your Slack channels.

## Installation

```
yarn global add clean-my-slack
```

or:

```
npm i -g clean-my-slack
```

## Configuration

### Create a token for your workspace to use Slack API

- Go to https://api.slack.com/apps
- Create a new app on the desired workspace (you must be logged in to this workspace)
- In your app settings, go to "OAuth & Permissions"
- In the "Scopes" tab, add the `channel:read`, `group:read`, `chat:write:users` scopes and apply changes
- On the top, click on "Install App to workspace", then "Authorize" the app when prompting
- Finally, copy your previously generated token 🙂

### Register the workspace in the CLI

Add your workspace to your CLI by running:

```
cmsk workspace:add -n <name of the workspace> -t <token>
```

> The name provided with -n option could be different of the real Slack workspace name.
> It's only for identification purpose at CLI side

## Usage

When one of your Slack channel becomes dirty, just run the following:

```
cmsk clean -w <workspace> -c <channel>
```

This will delete all messages from the channel, starting from the last.

> Due to Slack API's throttle rate, the CLI could pause if you delete a lot of messages at once
