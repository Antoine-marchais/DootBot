# DootBot - A telegram dooting bot

A Telegram bot hosted on GCP cloud functions, receiving updates from Telegram by webhook

## Setup

This bot uses nodejs and the node package manager to manage dependencies.
To install required dependencies, run `npm install`

## Local testing

A local nodejs server can be run for local testing.
To allow the bot to post messages, the bot token must be set as an environment variable:
```
export TOKEN=<your-bot-token>
```

The local server can be run with the following command:
```
node local_server.js
```

To allow the bot to receive real updates from telegram, the local port must be exposed on
a secured endpoint over the internet. For this I recommend using [ngrok](https://ngrok.com/).
The local endpoint must then be set as a hook to the telegram API:
```
ngrok http 8080
bash set_hook.sh <ngrok-https-endpoint> <your-bot-token>
```