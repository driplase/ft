const { SlashCommandBuilder, EmbedBuilder, Client, GatewayIntentBits, GuildMember } = require('discord.js');
const fs = require('node:fs');
const yaml = require('js-yaml');
const { lc, x, createStatFileIfItDoesntExists, getStat, setStat, setStatIfDoesntExists, unlockAchievement, addXP, getCoin, addCoin, ix, ep, Lynst, getRank, lyns, rankTopPercentile, getLoginSteak, getRequiredXP, uz, randASCIIstring, ctx, xtc, getRate, l, isJSON, ln, stp, isStreakSafe, lci } = require('../../fn')

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers
	]
});
module.exports = {
	data: new SlashCommandBuilder()
		.setName('stats')
		.setDescription('View your or someone\'s stats')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('User to get stats of.')
                .setRequired(false)),
	async execute(interaction) {
        try {
            await interaction.deferReply();
            let badgeslist = [];
            const target = interaction.options.getUser('user') ?? interaction.user;
            if (!target.bot) {
                setStatIfDoesntExists(target.id, "posts", 0)
                setStatIfDoesntExists(target.id, "reposted", 0)
                setStatIfDoesntExists(target.id, "grepost", 0)
                setStatIfDoesntExists(target.id, "liked", 0)
                setStatIfDoesntExists(target.id, "glike", 0)
                setStatIfDoesntExists(target.id, "achievements", [])
                setStatIfDoesntExists(target.id, "xp", 0)
                setStatIfDoesntExists(target.id, "level", 1)
                setStatIfDoesntExists(target.id, "lvxp", 0)
                setStatIfDoesntExists(target.id, "badges", [])
                setStatIfDoesntExists(target.id, "spaced", 0)
                setStatIfDoesntExists(target.id, "bm", 0)
                setStatIfDoesntExists(target.id, "gbm", 0)
                const streak = getLoginSteak(target.id);
                setStatIfDoesntExists(target.id, "previousStreak", null);
                setStatIfDoesntExists(target.id, "longestStreak", streak);
                setStatIfDoesntExists(target.id, "logged", 1);
                setStatIfDoesntExists(target.id, "coinsEarned", 0);
                setStatIfDoesntExists(target.id, "coinsSpent", 0);
                addXP(target.id, 0)
                const s = getStat(target.id);
                const m = interaction.guild.members.cache.get(target.id);
                const r = m.roles.cache;
                const bl = JSON.parse(fs.readFileSync('./badges/_emojidata.json'))
                const lynsts = Lynst(ep(s.posts, s.glike, s.grepost, s.gbm, s.spaced), s.xp, s.coinsEarned, s.coinsSpent, getCoin(target.id), s.logged)
                let lang, badgestring = "";
                for (let c = 0; c < s.badges.length; c++) {
                    badgeslist.push(bl[s.badges[c]] ?? "❓")
                }
                try {
                    lang = lci(interaction)
                    if (r.has('1276543473083875410')) {
                        if (!s.badges.includes('ltsl')) {
                            badgeslist.push(bl.ltsl)
                        }
                    }
                    if (r.has('1276542660315844728')) {
                        if (!s.badges.includes('ltsy')) {
                            badgeslist.push(bl.ltsy)
                        }
                    }
                } catch (e) {
                    console.error(e);
                    lang = "ja_jp";
                }
                if (badgeslist.length > 0) {
                    badgestring = "##";
                    for (let j = 0; j < badgeslist.length; j++) {
                        badgestring = `${badgestring} ${badgeslist[j]}`
                        console.log(badgeslist[j])
                    }
                    badgestring = `${badgestring}\n`
                }
                const N = JSON.parse(fs.readFileSync('./data/lb/xp.json'));
                const F = (isStreakSafe(streak, s.longestStreak, s.lastLogin)+1)*2;
                const e = new EmbedBuilder()
                    .setTitle(x('command.stats.title', lang).replace('<user>', uz(target.username, lang)))
                    .setDescription(`${badgestring}### ${ix(`rank${getRank(target.id)}`)} ***/ ${lynsts.toLocaleString()} ${ix('lynst')}***\n-# ***${x('topX', lang).replace('&n', rankTopPercentile(target.id))}***\n${ix('post')} ${s.posts.toLocaleString()} ${ix('like')} ${s.liked.toLocaleString()} ${ix('repost')} ${s.reposted.toLocaleString()} ${ix('bookmark')} ${s.bm.toLocaleString()} ${ix('space')} ${s.spaced.toLocaleString()} ${ix('coin')} ${getCoin(target.id).toLocaleString()}`)
                    .setFields([
                        {
                            "name": x('command.stats.engagements', lang),
                            "value": `${ix('like')} ${s.glike.toLocaleString()} ${ix('repost')} ${s.grepost.toLocaleString()} ${ix('bookmark')} ${s.gbm.toLocaleString()}`
                        },
                        {
                            "name": " ",
                            "value": `${'🛏️⚠️✅☑️'.slice(F,F+2)} ${x('command.stats.loginStreak', lang).replace('%d', streak.toLocaleString()).replace('%l', s.longestStreak.toLocaleString())}`
                        }
                    ])
                    .setThumbnail(interaction.guild.members.cache.get(target.id)?.avatarURL({ size: 64 }) ?? target?.displayAvatarURL({ size: 64 }))
                    .setFooter({ text: `Lv ${s.level.toLocaleString()} / ${s.xp.toLocaleString()} XP (#${N.findIndex(i => i.id === target.id) + 1})` })
                    .setColor(m.displayColor ?? 1744112)
                await interaction.editReply({
                    embeds: [e]
                });
            } else {
                await interaction.editReply({
                    content: "Bot doesn't have a stat data...",
                    ephemeral: true
                })
            }
        } catch (e) {
            console.error(e)
            await interaction.editReply({
                content: "Failed to get the user's stats. Probably, the user hasn't do something on this server."
            })
        }
	},
};