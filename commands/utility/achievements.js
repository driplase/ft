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

let ar = {};
Object.entries(JSON.parse(fs.readFileSync('./data/achievements.json'))).map(i => ar[i[0]] = i[1].rank)
const A = Object.entries(ar).map(r => r[0]);
let H = [];
for (let i = 0; i < A.length; i++) {
    H.push({
        "name": x(`achievement.${A[i]}.title`, 'en_us'),
        "nameLocalizations": {
            "ja": x(`achievement.${A[i]}.title`, 'ja_jp')
        },
        "value": A[i]
    })
}


module.exports = {
	data: new SlashCommandBuilder()
		.setName('achievements')
		.setDescription('View your or someone\'s achievement list')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('User to get achievements of.')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('info')
                .setDescription('Select an achievement what you want to check about it. (optional)')
                .setRequired(false)
                .setAutocomplete(true)),
        async autocomplete(interaction) {
            const focusedOption = interaction.options.getFocused(true);
            if (focusedOption.name === 'info') {
                let filtered;
                console.log(interaction.member)
                if (interaction.locale === "ja") {
                    filtered = H.filter(choice => choice.nameLocalizations.ja.includes(focusedOption.value));
                } else {
                    filtered = H.filter(choice => choice.name.toLowerCase().includes(focusedOption.value.toLowerCase()));
                }
                await interaction.respond(
                    filtered.slice(0, 25),
                );
            }
        },
	async execute(interaction) {
        try {
            const target = interaction.options.getUser('user') ?? interaction.user;
            setStatIfDoesntExists(target.id, "achievements", [])
            addXP(target.id, 0)
            const s = getStat(target.id), m = interaction.guild.members.cache.get(target.id);
            const r = m.roles.cache, ach = JSON.parse(fs.readFileSync('./data/achievements.json'));
            const bl = {}, co = {}
            Object.entries(ach).map(i => ar[i[0]] = i[1].rank),Object.entries(ach).map(i => bl[i[0]] = i[1].icon),Object.entries(ach).map(i => co[i[0]] = i[1].coin)
            const inf = interaction.options.getString('info');
            let lang, st = "";
            try {
                lang = lci(interaction)
            } catch (e) {
                console.error(e);
                lang = "ja_jp";
            }
            if (inf === null) {
                if (s.achievements.length > 0) {
                    for (let j = 0; j < s.achievements.length; j++) {
                        if (ar[s.achievements[j]] === "hidden") {
                            st = `${st}${bl[s.achievements[j]]} ${x("command.achievement.hidden", lang).replace('<id>', `\`${s.achievements[j]}\``)}\n`
                        } else {
                            st = `${st}${bl[s.achievements[j]]} ${x(`achievement.${s.achievements[j]}.title`, lang)}\n`
                        }
                    }
                } else {
                    st = `-# _${x("command.achievement.empty", lang)}_`
                }
                const e = new EmbedBuilder()
                    .setTitle(x('command.achievement.title', lang).replace('<user>', uz(target.username, lang)))
                    .setDescription(st)
                    .setThumbnail(interaction.guild.members.cache.get(target.id).avatarURL({ size: 64 }) ?? target.displayAvatarURL({ size: 64 }))
                await interaction.reply({
                    embeds: [e]
                });
            } else {
                if (ar[inf]) {
                    const ae = new EmbedBuilder()
                        .setAuthor({
                            name: x("command.achievement.information.title", lang)
                        })
                        .setTitle(x(`achievement.${inf}.title`, lang) ?? `achievement.${inf}.title`)
                        .setDescription(`${x(`achievement.${inf}.description`, lang) ?? `achievement.${inf}.description`}${co[inf]>0?`\n\n-# ***${ix('coin')} ${co[inf].toLocaleString()}***`:""}`)
                        .setColor(Math.round(Math.random() * 16777215))
                        .setFooter({ text: `[${x(`achievement.${ar[inf]}`, lang) ?? `achievement.${ar[inf]}`}]` });
                    await interaction.reply({
                        embeds: [ae],
                        ephemeral: ar[inf] === "hidden"
                    })
                } else {
                    await interaction.reply(`The achievement *(\`${inf}\`)* doesn't exists.`)
                }
            }
        } catch (e) {
            await interaction.reply({
                content: "Failed to get the user's stats. Probably, the user hasn't do something on this server."
            })
            console.error(e)
        }
	},
};