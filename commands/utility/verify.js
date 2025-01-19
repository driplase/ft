const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, Client, GatewayIntentBits } = require('discord.js');
const fs = require('node:fs');
const yaml = require('js-yaml');
const { tukyn } = require('../../config.json');
const { lc, x, createStatFileIfItDoesntExists, getStat, setStat, setStatIfDoesntExists, unlockAchievement, addXP, getCoin, addCoin, ix, ep, Lynst, getRank, lyns, rankTopPercentile, getLoginSteak, getRequiredXP, uz, randASCIIstring, ctx, xtc, getRate, l, isJSON, ln, stp } = require('../../fn')

const client = new Client({
	intents: [
        GatewayIntentBits.Guilds
    ]
});

module.exports = {
	data: new SlashCommandBuilder()
		.setName('verify')
		.setDescription('give a verified badge')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('User.')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
	async execute(interaction) {
        try {
            const target = interaction.options.getUser('user');
            const bid = "verified"
            const g = interaction.guild, me = await g.members.fetch(target.id);
            const nvc = g.channels.cache.get('1274655940343500901')
            const ro = JSON.parse(fs.readFileSync('./badges/roles.json'))
            setStatIfDoesntExists(target.id, "badges", [])
            let b = getStat(target.id).badges;
            if (!b.includes(bid)) {
                b.push(bid)
                setStat(target.id, "badges", b)
                const h = new EmbedBuilder()
                    .setTitle('Verified badge info')
                    .setDescription(`<@!${target.id}> verified!`)
                    .setColor(Math.round(Math.random() * 16777215))
                    .setFooter({ text: `Verified by ${interaction.user.username}` });
                nvc.send({
                    embeds: [h]
                })
                const br = me.roles.cache.map(i => Object.keys(ro).find(j=>ro[j]===i.id)).filter(i=>!!i)
                if (!me.roles.cache.has(ro.verified) && !br.length) {
                    me.roles.add(ro.verified)
                }
                await interaction.reply({
                    content: `<@!${target.id}> verified!`,
                    ephemeral: true
                });
            } else {
                await interaction.reply({
                    content: `<@!${target.id}> is already verified`,
                    ephemeral: true
                });
            }
        } catch (e1) {
            try {
                console.error(e1)
                await interaction.reply({
                    content: "error gg idk",
                    ephemeral: true
                })
            } catch (e2) {
                console.error(e2)
            }
        }
	},
};