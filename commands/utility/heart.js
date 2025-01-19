const { SlashCommandBuilder } = require('discord.js');
const { lc, x, createStatFileIfItDoesntExists, getStat, setStat, setStatIfDoesntExists, unlockAchievement, addXP, getCoin, addCoin, ix, ep, Lynst, getRank, lyns, rankTopPercentile, getLoginSteak, getRequiredXP, uz, randASCIIstring, ctx, xtc, getRate, l, isJSON, ln, stp } = require('../../fn')
module.exports = {
	data: new SlashCommandBuilder()
		.setName('heart')
		.setDescription('my heartbeat.'),
	async execute(interaction) {
		await interaction.reply({
            content: "https://first.treron.jp/"
        });
	},
};