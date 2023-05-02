# golftour-bot

Bot for managing the Golftour website and to report data to the dashboard

## Setup

### Wrangler Secrets

- `PUBLIC_KEY` (the Discord bot public key)
- `DISCORD_TOKEN` (the Discord bot token)

### Discord Slash Commands

Data using `{}` are required paramaters and `()` are optional.

```
PUT https://discord.com/api/v9/applications/{application_id}/(guilds/{guild_id})/commands
Headers: 
    Authorization: Bot YOUR_DISCORD_TOKEN,
    Content-Type: application/json

Body:
[
	{
		"name": "report_result",
		"description": "Report the result to the website",
		"type": 1,
		"options": [
			{
				"type": 3,
				"name": "code",
				"description": "The gamecard code",
				"required": true
			}
		]
	}
]
```
