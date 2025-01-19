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
		.setName('18')
		.setDescription('Give or remove an 18+ badge.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('give')
                .setDescription('give the badge.'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('remove the badge.')),
	async execute(interaction) {
        try {
            const target = interaction.user;
            const bid = '18'
            const g = interaction.guild;
            const nvc = g.channels.cache.get('1274655940343500901')
            setStatIfDoesntExists(target.id, "badges", [])
            const bl = JSON.parse(fs.readFileSync('./badges/_emojidata.json'))
            let b = getStat(target.id).badges;
            const member = interaction.member;
            /*await interaction.deferReply({
                ephemeral: true
            });*/
            if (interaction.options.getSubcommand() === "give") {
                if (!b.includes(bid)) {
                    b.push(bid)
                    setStat(target.id, "badges", b)
                    const h = new EmbedBuilder()
                        .setTitle('Badge info')
                        .setDescription(`<@!${target.id}> got a ${bl[bid] ?? `❓`}(${bid}) badge!`)
                        .setColor(Math.round(Math.random() * 16777215))
                        .setFooter({ text: `Given by ${interaction.user.username}` });
                    nvc.send({
                        embeds: [h]
                    })
                    member.setNickname(`${member.displayName} 🔞`, "Used /18 give command.")
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
                    const h = new EmbedBuilder()
                        .setTitle('Badge info')
                        .setDescription(`<@!${target.id}> lost a ${bl[bid] ?? `❓`}(${bid}) badge...`)
                        .setColor(Math.round(Math.random() * 16777215))
                        .setFooter({ text: `Revoked by ${interaction.user.username}` });
                    nvc.send({
                        embeds: [h]
                    })
                    member.setNickname(member.displayName.replace(' 🔞', ''), "Used /18 remove command.")
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