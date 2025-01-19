const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('node:fs');
const yaml = require('js-yaml');
const { lc, x, createStatFileIfItDoesntExists, getStat, setStat, setStatIfDoesntExists, unlockAchievement, addXP, getCoin, addCoin, ix, ep, Lynst, getRank, lyns, rankTopPercentile, getLoginSteak, getRequiredXP, uz, randASCIIstring, ctx, xtc, getRate, l, isJSON, ln, stp } = require('../../fn')
module.exports = {
	data: new SlashCommandBuilder()
		.setName('say')
		.setDescription('only driplase run this lolol hahah xd lmao')
        .addStringOption(option =>
            option.setName('content')
                .setDescription('put here an awesome content...')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	async execute(interaction) {
        if (interaction.user.id === "959034815766728714") {
            interaction.channel.send(interaction.options.getString('content'))
            await interaction.reply({
                ephemeral: true,
                content: `Done!`
            });
        } else {
            await interaction.reply({
                ephemeral: true,
                content: `🥴\n-# try reading my bad english sentences. i thought it wasn't so hard.`
            });
        }
	}
}