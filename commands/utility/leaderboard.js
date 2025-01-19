const { SlashCommandBuilder, EmbedBuilder, Client, GatewayIntentBits, GuildMember } = require('discord.js');
const fs = require('node:fs');
const yaml = require('js-yaml');
const { lc, x, createStatFileIfItDoesntExists, getStat, setStat, setStatIfDoesntExists, unlockAchievement, addXP, getCoin, addCoin, ix, ep, Lynst, getRank, lyns, rankTopPercentile, getLoginSteak, getRequiredXP, uz, randASCIIstring, ctx, xtc, getRate, l, isJSON, ln, stp, lci } = require('../../fn')
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers
	]
});


module.exports = {
	data: new SlashCommandBuilder()
		.setName('leaderboard')
		.setDescription('Shows the XP Leaderboard. (Top 16)')
        .addIntegerOption(option =>
            option.setName('page')
                .setDescription('The leaderboard page number.')
                .setRequired(false)),
	async execute(interaction) {
        try {
            const pg = interaction.options.getInteger('page') ?? 1;
            await interaction.deferReply();
            let lang = lci(interaction);
            const g = JSON.parse(fs.readFileSync('./data/lb/xp.json'));
            let r = "", u = interaction.user.id;
            const p = g.findIndex(i => i.id === u);
            const f = g.slice(16 * (pg - 1), pg * 16);
            const bl = JSON.parse(fs.readFileSync('./badges/_emojidata.json'));
            
            if (p < 16 * (pg - 1) && p !== -1) {
                const s = getStat(u);
                let badgeslist = [], badgestring = "";
                for (let c = 0; c < s.badges.length; c++) {
                    badgeslist.push(bl[s.badges[c]] ?? "❓")
                }
                try {
                    await interaction.guild.members.fetch(u)
                    if (interaction.member.roles.cache.has('1276543473083875410')) {
                        if (!s.badges.includes('ltsl')) {
                            badgeslist.push(bl.ltsl)
                        }
                    }
                    if (interaction.member.roles.cache.has('1276542660315844728')) {
                        if (!s.badges.includes('ltsy')) {
                            badgeslist.push(bl.ltsy)
                        }
                    }
                } catch (e) {
                    console.error(e)
                }
                if (badgeslist.length > 0) {
                    for (let j = 0; j < badgeslist.length; j++) {
                        badgestring = `${badgestring} ${badgeslist[j]}`
                    }
                }
                r = `-# ___\\#${p + 1} | <@${u}>${badgestring} \`Lv ${g[p].level?.toLocaleString() ?? 1} / ${(g[p].xp ?? 0).toLocaleString()}xp\`___\n`
            }
            for (let i = 0; i < f.length; i++) {
                const s = getStat(f[i].id);
                if (!s.level) {
                    addXP(f[i].id, 0)
                }
                let badgeslist = [], badgestring = "", X = "";
                if (!s.badges) { s.badges = [] }
                for (let c = 0; c < s.badges.length; c++) {
                    badgeslist.push(bl[s.badges[c]] ?? "❓")
                }
                try {
                    lyns(f[i].id)
                    const tm = await interaction.guild.members.fetch(f[i].id)
                    if (tm.roles.cache.has('1276543473083875410')) {
                        if (!s.badges.includes('ltsl')) {
                            badgeslist.push(bl.ltsl)
                        }
                    }
                    if (tm.roles.cache.has('1276542660315844728')) {
                        if (!s.badges.includes('ltsy')) {
                            badgeslist.push(bl.ltsy)
                        }
                    }
                } catch (e) {
                    console.error(e);
                    console.error(f[i].id)
                }
                if (badgeslist.length > 0) {
                    for (let j = 0; j < badgeslist.length; j++) {
                        badgestring = `${badgestring} ${badgeslist[j]}`
                    }
                }
                X = ""
                if (i + 16 * (pg - 1) < 3) {
                    if (i + 16 * (pg - 1) < 2) {
                        if (i + 16 * (pg - 1) < 1) {
                            X = "## "
                        } else {
                            X = "### "
                        }
                    } else {
                        X = "**"
                    }
                }
                if (i === p - 16 * (pg - 1)) {
                    r = `${r}${X}___\\#${i + 1 + 16 * (pg - 1)} | <@${f[i].id}>${badgestring} \`Lv ${f[i].level?.toLocaleString() ?? 1} / ${(f[i].xp ?? 0).toLocaleString()}xp\`___${(i + 16 * (pg - 1) === 2) ? "**" : ""}\n`;
                } else {
                    r = `${r}${X}\\#${i + 1 + 16 * (pg - 1)} | <@${f[i].id}>${badgestring} \`Lv ${f[i].level?.toLocaleString() ?? 1} / ${(f[i].xp ?? 0).toLocaleString()}xp\`${(i + 16 * (pg - 1) === 2) ? "**" : ""}\n`;
                }
            }
            if (p > 16 * pg) {
                const s = getStat(u);
                lyns(u)
                let badgeslist = [], badgestring = "";
                for (let c = 0; c < s.badges.length; c++) {
                    badgeslist.push(bl[s.badges[c]] ?? "❓")
                }
                await interaction.guild.members.fetch(u)
                if (interaction.member.roles.cache.has('1276543473083875410')) {
                    if (!s.badges.includes('ltsl')) {
                        badgeslist.push(bl.ltsl)
                    }
                }
                if (interaction.member.roles.cache.has('1276542660315844728')) {
                    if (!s.badges.includes('ltsy')) {
                        badgeslist.push(bl.ltsy)
                    }
                }
                if (badgeslist.length > 0) {
                    for (let j = 0; j < badgeslist.length; j++) {
                        badgestring = `${badgestring} ${badgeslist[j]}`
                    }
                }
                r = `${r}-# ___\\#${p + 1} | <@!${u}>${badgestring} \`Lv ${g[p].level.toLocaleString()} / ${(g[p].xp).toLocaleString()}xp\`___\n`
            }
            r.replace(/\n$/, '');
            const m = new EmbedBuilder()
                .setTitle(x('command.leaderboard.title', lang))
                .setDescription(`${r}`)
                .setTimestamp(new Date().getTime())
                .setColor(1744112)
                .setFooter({ text: `ᴘᴀɢᴇ ${pg}` })
            await interaction.editReply({
                embeds: [m]
            })
        } catch (e) {
            console.error(e)
            await interaction.editReply({
                content: "Failed to get the XP Leaderboard... :("
            })
        }
	},
};