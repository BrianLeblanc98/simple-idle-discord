# simple-idle-discord 0.0.1

A one command idle game for Discord written in plain JavaScript.

# Usage
- Add to your server: [link]()
- Command: `/i`

---

# Developer Guide
- `index.js` - Main file, runs initialization steps and the bot
- `command.js` - All code related to the command
- `database.js` - All code related to the database

### Requirements
- node
- npm
- sqlite3

### Setup
Create `.env` with the following format:
```
DISCORD_TOKEN=
CLIENT_ID=
DEV_GUILD_ID=
```

Once `.env` is created and has the correct values:
```
npm i
npm run start
```