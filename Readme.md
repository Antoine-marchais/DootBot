# DootBot - A telegram dooting bot

A Telegram bot hosted on GCP cloud functions and backed by firestore, receiving updates from Telegram by webhook

## Local testing

This bot uses nodejs and the node package manager to manage dependencies.
To install required dependencies, run `npm install`

A local nodejs server can be run for local testing.
To allow the bot to post messages, the bot token must be set as an environment variable.
Furthermore, a service account is used to access the firestore database. A key for the service account
must be downloaded and its path set as an environment variable for authentication of the local server.
```
export TOKEN=<your-bot-token>
export GOOGLE_APPLICATION_CREDENTIALS=<path-to-key-file>
```

The local server can be run with the following command:
```
node local_server.js
```

**Using local requests**

You can send mocked update to the local server by sending the following `POST` request to `localhost:8080`:

```json
{
  "update_id": 1234,
  "message": {
    "message_id": 1234,
    "from": {
      "id": <your_chat_id>,
      "is_bot": false,
      "first_name": "John",
      "last_name": "Doe",
      "username": "johndoe",
      "language_code": "en"
    },
    "chat": {
      "id": <your_chat_id>,
      "first_name": "John",
      "last_name": "Doe",
      "username": "johndoe",
      "type": "private"
    },
    "date": 1234,
    "text": "/doot",
    "entities": [
        {
            "length": 5,
            "offset": 0,
            "type": "bot_command"
        }
    ]
  }
}
```

The chat id field for your telegram account can be discovered using the following method: https://www.alphr.com/find-chat-id-telegram/

You may also wish to change the text and entities parameters to test out other message formats.

**Receiving real updates**

To allow the bot to receive actual updates from telegram, the local port must be exposed on
a secured endpoint over the internet. For this I recommend using [ngrok](https://ngrok.com/).
The local endpoint must then be set as a hook to the telegram API:
```
ngrok http 8080
bash set_hook.sh <ngrok-https-endpoint> <your-bot-token>
```