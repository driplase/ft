// 2,000XP => 1 coin lmao

const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, Client, GatewayIntentBits } = require('discord.js');
const fs = require('node:fs');
const yaml = require('js-yaml');
const { tukyn } = require('../../config.json');
const { lc, x, createStatFileIfItDoesntExists, getStat, setStat, setStatIfDoesntExists, unlockAchievement, addXP, getCoin, addCoin, ix, ep, Lynst, getRank, lyns, rankTopPercentile, getLoginSteak, getRequiredXP, uz, randASCIIstring, ctx, xtc, getRate, l, isJSON, ln, stp, ft } = require('../../fn')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('exchange')
		.setDescription('exchange to something.')
        .addStringOption(option => 
            option.setName('fromto')
                .setDescription('select what you want to exchange.')
                .setRequired(true)
                .addChoices(
                    { name: 'XP to coins', value: 'xp2c' },
                    { name: 'coins to XP', value: 'c2xp' },
                ))
        .addIntegerOption(option => 
            option.setName('amount')
                .setDescription('Amount to be exchanged.')
                .setRequired(true)),
	async execute(interaction) {
        try {
            let lang;
            if (interaction.member.roles.cache.has('1274696519538180096')) {
                lang = "en_us";
            } else if (interaction.member.roles.cache.has('1275649994384343153')) {
                lang = "ja_as";
            } else if (interaction.member.roles.cache.has('1275043743149326428')) {
                lang = "ja_jp";
            } else {
                lang = l[interaction.locale] ?? "en_us";
            }
            const amount = interaction.options.getInteger('amount');
            const ft = interaction.options.getString('fromto')
            setStatIfDoesntExists(interaction.user.id, "xp", 0)
            setStatIfDoesntExists(interaction.user.id, "level", 1)
            setStatIfDoesntExists(interaction.user.id, "lvxp", 0)
            let s = getStat(interaction.user.id);
            if (ft === "xp2c") {
                if (s.xp >= amount) {
                    const y = Math.round(xtc(amount));
                    const r = addCoin(interaction.user.id, y, interaction.guild);
                    if (r) {
                        addXP(interaction.user.id, -amount);
                        await interaction.reply({
                            content: `\`\`\`${amount} XP -> ${y} coins\`\`\``
                        })
                    } else {
                        await interaction.reply({
                            ephemeral: true,
                            content: x("command.exchange.notEnoughCoin", lang)
                        })
                    }
                } else {
                    await interaction.reply({
                        ephemeral: true,
                        content: x("command.exchange.notEnoughXP", lang)
                    })
                }
            }
            if (ft === "c2xp") {
                if (getCoin(interaction.user.id) >= amount) {
                    const y = Math.round(ctx(amount));
                    const r = addCoin(interaction.user.id, -amount, interaction.guild);
                    if (r) {
                        addXP(interaction.user.id, y);
                        await interaction.reply({
                            content: `\`\`\`${amount} coins -> ${y} XP\`\`\``
                        })
                    } else {
                        await interaction.reply({
                            ephemeral: true,
                            content: x("command.exchange.notEnoughCoin", lang)
                        })
                    }
                } else {
                    await interaction.reply({
                        ephemeral: true,
                        content: x("command.exchange.notEnoughXP", lang)
                    })
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