const { SlashCommandBuilder, EmbedBuilder, Client, GatewayIntentBits, GuildMember } = require('discord.js');
const fs = require('node:fs');
const yaml = require('js-yaml');
const { lc, x, createStatFileIfItDoesntExists, getStat, setStat, setStatIfDoesntExists, unlockAchievement, addXP, getCoin, addCoin, ix, ep, Lynst, getRank, lyns, rankTopPercentile, getLoginSteak, getRequiredXP, uz, randASCIIstring, ctx, xtc, getRate, l, isJSON, ln, stp } = require('../../fn')
module.exports = {
	data: new SlashCommandBuilder()
		.setName('rate')
		.setDescription('check a exchange rate.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('ctx')
                .setDescription('rate: 1 coin to xps.')
                .addIntegerOption(option => 
                    option.setName('amount')
                        .setDescription('amount.')
                        .setRequired(false)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('xtc')
                .setDescription('rate: 1 xp to coins.')
                .addIntegerOption(option => 
                    option.setName('amount')
                        .setDescription('amount.')
                        .setRequired(false))),
	async execute(interaction) {
        const s = interaction.options.getSubcommand(), b = interaction.options.getInteger('amount') ?? 1, a = new EmbedBuilder().setTitle(s.toUpperCase())
            .setDescription(`${b} ${s === "ctx" ? ix('coin') : s === 'xtc' ? 'xp' : ''} ⇔ ${Math.round((s === "ctx" ? ctx(b) : s === 'xtc' ? xtc(b) : null) * 10000) / 10000} ${s === "ctx" ? 'xp' : s === 'xtc' ? ix('coin') : ''}`)
            .setColor(Math.round(Math.random() * 16777215))
        await interaction.reply({
            embeds: [ a ]
        })
	},
};