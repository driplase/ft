const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('node:fs');
const yaml = require('js-yaml');
const { lc, x, createStatFileIfItDoesntExists, getStat, setStat, setStatIfDoesntExists, unlockAchievement, addXP, getCoin, addCoin, ix, ep, Lynst, getRank, lyns, rankTopPercentile, getLoginSteak, getRequiredXP, uz, randASCIIstring, ctx, xtc, getRate, l, isJSON, ln, stp } = require('../../fn')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('shorten')
		.setDescription('hmmmmmmm')
        .addStringOption(option => 
            option.setName('service')
                .setDescription('select a url shortener service (default: j0.si)')
                .setRequired(true)
                .addChoices(
                    { name: 'j0.si', value: 'j0si' },
                    { name: 'x.gd', value: 'xgd' },
                    { name: 'is.gd', value: 'isgd' },
                    { name: 'v.gd', value: 'vgd' },
                ))
        .addStringOption(option =>
            option.setName('url')
                .setDescription('put here an awesome content...')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('custom')
                .setDescription('set a custom url.')
                .setRequired(false))
        .addBooleanOption(option =>
            option.setName('ephemeral')
                .setDescription('if you want to hide the shortened link, enter true. (default: true)')
                .setRequired(false)),
	async execute(interaction) {
        try {
            interaction.channel.send(interaction.options.getString('content'))
            const _ = [interaction.options.getString('custom')]
            const h = interaction.options.getString('service'), u = encodeURIComponent(interaction.options.getString('url')), c = _[0] ? encodeURIComponent(_[0]) : null, p = interaction.options.getBoolean('ephemeral') ?? true;
            await interaction.deferReply({ ephemeral: p })
            if (h === "xgd") {
                (async () => {
                    const r1 = await fetch(`https://xgd.io/V1/shorten?key=${process.env.XGD_API_KEY}&url=${u}${c?`&shortid=${c}`:""}`)
                    const r2 = await r1.json()
                    console.log(await r2)
                    if (r2.status === 200) {
                        const E = new EmbedBuilder()
                            .setAuthor({ name: "x.gd" })
                            .setDescription(await r2.shorturl)
                            .setColor(Math.round(Math.random() * 16777215))
                        await interaction.editReply({
                            embeds: [E],
                            ephemeral: p
                        })
                    } else {
                        const E = new EmbedBuilder()
                            .setAuthor({ name: "x.gd" })
                            .setTitle(r2.status)
                            .setDescription(`\`\`\`${r2.message}\`\`\``)
                            .setColor(0xFF2413)
                        await interaction.editReply({
                            embeds: [E],
                            ephemeral: true
                        })
                    }
                })()
            } else if (h === "isgd") {
                (async () => {
                    const r1 = await fetch(`https://is.gd/create.php?format=json&url=${u}${c?`&shorturl=${c}`:""}`)
                    const r2 = JSON.parse(await r1.text())
                    if (r1.status === 200) {
                        const E = new EmbedBuilder()
                            .setAuthor({ name: "is.gd" })
                            .setDescription(await r2.shorturl)
                            .setColor(Math.round(Math.random() * 16777215))
                        await interaction.editReply({
                            embeds: [E],
                            ephemeral: p
                        })
                    } else {
                        const E = new EmbedBuilder()
                            .setAuthor({ name: "is.gd" })
                            .setTitle(r2.errorcode)
                            .setDescription(`\`\`\`${r2.errormessage}\`\`\``)
                            .setColor(0xFF2413)
                        await interaction.editReply({
                            embeds: [E],
                            ephemeral: true
                        })
                    }
                })()
            } else if (h === "vgd") {
                (async () => {
                    const r1 = await fetch(`https://v.gd/create.php?format=json&url=${u}${c?`&shorturl=${c}`:""}`)
                    const r2 = JSON.parse(await r1.text())
                    if (r1.status === 200) {
                        const E = new EmbedBuilder()
                            .setAuthor({ name: "v.gd" })
                            .setDescription(await r2.shorturl)
                            .setColor(Math.round(Math.random() * 16777215))
                        await interaction.editReply({
                            embeds: [E],
                            ephemeral: p
                        })
                    } else {
                        const E = new EmbedBuilder()
                            .setAuthor({ name: "v.gd" })
                            .setTitle(r2.errorcode)
                            .setDescription(`\`\`\`${r2.errormessage}\`\`\``)
                            .setColor(0xFF2413)
                        await interaction.editReply({
                            embeds: [E],
                            ephemeral: true
                        })
                    }
                })()
            } else if (h === "j0si") {
                (async () => {
                    const r1 = await fetch(`https://j0.si/shorten?url=${u}${c?`&path=${c}`:""}`, { method: "POST" })
                    const r2 = JSON.parse(await r1.text())
                    if (r2.i === 0) {
                        const E = new EmbedBuilder()
                            .setAuthor({ name: "j0.si" })
                            .setDescription(`https://j0.si/${await r2.path}`)
                            .setColor(Math.round(Math.random() * 16777215))
                        await interaction.editReply({
                            embeds: [E],
                            ephemeral: p
                        })
                    } else {
                        const E = new EmbedBuilder()
                            .setAuthor({ name: "j0.si" })
                            .setTitle(`x${r2.i}`)
                            .setDescription(`\`\`\`${r2.c}\`\`\``)
                            .setColor(0xFF2413)
                        await interaction.editReply({
                            embeds: [E],
                            ephemeral: true
                        })
                    }
                })()
            }
        } catch (e) {
            await interaction.reply({
                ephemeral: true,
                content: `failed...`
            });
            console.error(e)
        }
	}
}