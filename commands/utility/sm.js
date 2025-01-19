const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('node:fs');
const yaml = require('js-yaml');
const { lc, x, createStatFileIfItDoesntExists, getStat, setStat, setStatIfDoesntExists, unlockAchievement, addXP, getCoin, addCoin, ix, ep, Lynst, getRank, lyns, rankTopPercentile, getLoginSteak, getRequiredXP, uz, randASCIIstring, ctx, xtc, getRate, l, isJSON, ln, stp } = require('../../fn')
module.exports = {
	data: new SlashCommandBuilder()
		.setName('sm')
		.setDescription('set channel slowmode')
        .addIntegerOption(option => 
            option.setName('duration')
                .setDescription('rate limit is awesome (actually no)')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('reason, optional.')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
	async execute(interaction) {
        const target = interaction.channel;
        const d = interaction.options.getInteger('duration');
        target.setRateLimitPerUser(d, `"${(interaction.options.getString('reason') ?? "No reason specified.")}" - ${interaction.user.username}`)
        await interaction.reply({
            ephemeral: true,
            content: `<:verified:1283736290197770291>`
        });
	}
}