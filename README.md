# legacy first treron code
legacy first treron source. (a discord bot for light treron.)\
i'm publishing the source because i got fired from light treron, and it'll probably never be reused again.\
this code wasn't intended to be readable by everyone.\
this source is especially made for light treron, so don't forget to change the `guildId` and so on.\
this bot requires Second Treron (another discord bot for light treron), so this means it won't work unless second treron became open source or remove codes related to second treron from this source.\
\
**SINCE LIGHT TRERON IS NO LONGER USING THIS, I AM NOT RESPONSIBLE FOR ANY PROBLEMS MAY ARISE.**\
*Use this at your own risk.*
### small info
- 5 months of develop
- over 4,000 lines of node.js codes
- features:
    - repost
    - DM notifications
    - share posts on website
    - [DISBOARD](https://disboard.org) bump and [dissoku](https://dissoku.net) up reminder
    - supports multiple language
        - most of them were joke. only english was the serious one.
    - user stats
    - make it a quote
    - request coins
    - trend and timeline preview on website
    - UNNECESSARY RANDOM FEATURES
        - AI chat using [Google AI Studio](https://aistudio.google.com)
            - sometimes post random things in timeline too
        - Achievements
        - XP
        - Coins to XP and vice versa Exchange
            - which led to coin inflation
        - ranking
            - 12 ranking tiers
        - Text to Speech in voice channel using UTAU voicebank
            - only single tones supported
            - this source uses Asakaze Takuma single tones, you can download it from [here](https://asakaze-takuma.1.choume.net/utau.html)
                - to use this UTAU voicebank, find `朝風 拓真 単独音V1` folder in `朝風 拓真 単独音V1.zip`, rename it to `AsakazeTakuma_Tandokuv1`, and put it in `./data` folder.
                - also uses [VOICEVOX](https://voicevox.hiroshiba.jp/), so don't forget to install it.
        - subscriptions? idk (experimental)
        - Login Streak
        - Badges
        - Leaderboard
        - Shorten long URLs using Slash Commands
        - rainbow color role (probably not unnecessary because of second treron's color gacha)
    - some of features has explanations in [this Notion page](https://first-treron.notion.site/13ae0fa8fa7b80168278e5820d8822c8), as long as it won't be changed.
### web features
`localhost:3728` = ftweb\
`localhost:19377` = light treron share\
`localhost:16287` = test (not useful)
### how to run this script
run `npm install` to install required packages,\
then run `main.js` and `gl.js` using `node <path>` or [pm2](https://pm2.keymetrics.io/)\
*(this bot is so unstable, pm2 is recommended)*