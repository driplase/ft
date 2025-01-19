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
		.setName('unverify')
		.setDescription('revoke a verified badge')
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
            setStatIfDoesntExists(target.id, "badges", [])
            let b = getStat(target.id).badges;
            const ro = JSON.parse(fs.readFileSync('./badges/roles.json'))
            const z = b.indexOf(bid)
                if (z > -1) {
                    b.splice(z, 1);
                    setStat(target.id, "badges", b)
                    const h = new EmbedBuilder()
                        .setTitle('Verified badge info')
                        .setDescription(`<@!${target.id}> unverified...`)
                        .setColor(Math.round(Math.random() * 16777215))
                        .setFooter({ text: `Unverified by ${interaction.user.username}` })
                    nvc.send({
                        embeds: [h]
                    })
                    if (me.roles.cache.has(ro.verified)) {
                        me.roles.remove(ro.verified)
                    }
                    await interaction.reply({
                        content: `<@!${target.id}> unverified...`,
                        ephemeral: true
                    });
                } else {
                    await interaction.reply({
                        content: `<@!${target.id}> doesn't have a verified badge.`,
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