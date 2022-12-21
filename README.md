# Tbuzzer

# Introduction
Tbuzzer is a simple tool that monitors cryptocurrency prices from different exchanges and sends notifications to Telegram when the price reaches a certain level. 
The app is using the powerfull <a href="https://github.com/ccxt/ccxt">CCXT</a> library for fetching cryptocurrency prices from all the major cryptocurrency exchanges.

# Installation

## Installing dependencies
After cloning the repository, open a terminal in the main folder and install all the dependecies  needed using
```npm install```

## Seeting up the Telgram Bot for receiving notifications

First you need to register a bot using <a href="https://telegram.me/BotFather">BotFather</a>, which is a free Telegram bot used to create and manage other bots. 

Once you hit ```/start```, you will see a list of commands that can be used

![bot_menu](https://i.imgur.com/fXmZKEf.png)

To create a new bot send ```/newbot``` command. You will be asked to type a name for your new bot and to create a unique username for it (THE USERNAME MUST BE UNIQUE AND HAS TO CONTAIN ```bot``` AT THE END).
Once these steps are complete, BotFather will provide you the API access token, which must be copied to ```.env``` file at ```TOKEN ='PASTE_YOUR_TOKEN'```

To get the ```chat_id``` you need to create a new group chat and add the newly created bot, then access <a href="https://web.telegram.org/">Telegram web app</a>, login and go to your new group chat where you added the bot. 
In the link you will find ```chat_id```, copy it (all the characters after ```#```) and paste it into ```.env``` file to ```CHAT_IT='PASTE_YOUR_CHAT_ID'```

![chat_id](https://i.imgur.com/fqTYRMw.png)

# Running the app

After the instalation is complete and the Telegram bot is set up, start the app in the same terminal used for instalation using ```npm start```.
When starting the app it will take a few minutes for all the available exchanges and pairs to load.
After the loading is complete the server will be running ussualy at "http://localhost:3000"
