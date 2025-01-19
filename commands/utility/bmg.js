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
		.setName('bmg')
		.setDescription('edit badges')
        .addSubcommand(subcommand =>
            subcommand
                .setName('give')
                .setDescription('give a badge.')
                .addUserOption(option => 
                    option.setName('user')
                        .setDescription('User.')
                        .setRequired(true))
                .addStringOption(option => 
                    option.setName('badgeid')
                        .setDescription('badge id.')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('remove a badge.')
                .addUserOption(option => 
                    option.setName('user')
                        .setDescription('User.')
                        .setRequired(true))
                .addStringOption(option => 
                    option.setName('badgeid')
                        .setDescription('badge id.')
                        .setRequired(true)))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
	async execute(interaction) {
        try {
            const target = interaction.options.getUser('user');
            const bid = interaction.options.getString('badgeid')
            const g = interaction.guild, me = await g.members.fetch(target.id);
            const nvc = g.channels.cache.get('1274655940343500901')
            setStatIfDoesntExists(target.id, "badges", [])
            const bl = JSON.parse(fs.readFileSync('./badges/_emojidata.json'))
            const ro = JSON.parse(fs.readFileSync('./badges/roles.json'))
            let b = getStat(target.id).badges;
            /*await interaction.deferReply({
                ephemeral: true
            });*/
            if (interaction.options.getSubcommand() === "give") {
                if (!b.includes(bid)) {
                    b.push(bid)
                    setStat(target.id, "badges", b)
                    if (bid === "verified") {
                        const h = new EmbedBuilder()
                            .setTitle('Verified badge info')
                            .setDescription(`<@!${target.id}> verified!`)
                            .setColor(Math.round(Math.random() * 16777215))
                            .setFooter({ text: `Verified by ${interaction.user.username}` });
                        nvc.send({
                            embeds: [h]
                        })
                    } else {
                        const h = new EmbedBuilder()
                            .setTitle('Badge info')
                            .setDescription(`<@!${target.id}> got a ${bl[bid] ?? `❓`}(${bid}) badge!`)
                            .setColor(Math.round(Math.random() * 16777215))
                            .setFooter({ text: `Given by ${interaction.user.username}` });
                        nvc.send({
                            embeds: [h]
                        })
                    }
                    try {
                        const br = me.roles.cache.map(i => Object.keys(ro).find(j=>ro[j]===i.id)).filter(i=>!!i)
                        if (!me.roles.cache.has(ro[bid]) && !br.length) {
                            me.roles.add(ro[bid])
                        }
                    } catch (e) {
                        console.error(e)
                    }
                    await interaction.reply({
                        content: `<@!${target.id}>: +${bl[bid] ?? `❓`}(${bid})`,
                        ephemeral: true
                    });
                } else {
                    await interaction.reply({
                        content: `<@!${target.id}>: nothing changed`,
                        ephemeral: true
                    });
                }
            } else if (interaction.options.getSubcommand() === "remove") {
                const z = b.indexOf(bid)
                if (z > -1) {
                    b.splice(z, 1);
                    setStat(target.id, "badges", b)
                    if (bid === "verified") {
                        const h = new EmbedBuilder()
                            .setTitle('Verified badge info')
                            .setDescription(`<@!${target.id}> unverified...`)
                            .setColor(Math.round(Math.random() * 16777215))
                            .setFooter({ text: `Unverified by ${interaction.user.username}` })
                        nvc.send({
                            embeds: [h]
                        })
                    } else {
                        const h = new EmbedBuilder()
                            .setTitle('Badge info')
                            .setDescription(`<@!${target.id}> lost a ${bl[bid] ?? `❓`}(${bid}) badge...`)
                            .setColor(Math.round(Math.random() * 16777215))
                            .setFooter({ text: `Revoked by ${interaction.user.username}` });
                        nvc.send({
                            embeds: [h]
                        })
                    }
                    if (me.roles.cache.has(ro[bid])) {
                        me.roles.remove(ro[bid])
                    }
                    await interaction.reply({
                        content: `<@!${target.id}>: -${bl[bid] ?? "❓"}(${bid})`,
                        ephemeral: true
                    });
                } else {
                    await interaction.reply({
                        content: `<@!${target.id}>: nothing changed`,
                        ephemeral: true
                    });
                }
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