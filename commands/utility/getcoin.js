const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('node:fs');
const yaml = require('js-yaml');
const { lc, x, createStatFileIfItDoesntExists, getStat, setStat, setStatIfDoesntExists, unlockAchievement, addXP, getCoin, addCoin, ix, ep, Lynst, getRank, lyns, rankTopPercentile, getLoginSteak, getRequiredXP, uz, randASCIIstring, ctx, xtc, getRate, l, isJSON, ln, stp } = require('../../fn')
module.exports = {
	data: new SlashCommandBuilder()
		.setName('getcoin')
		.setDescription('if you r nt a mod report via contact or mod\'s dm')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('User.')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
	async execute(interaction) {
        try {
            const target = interaction.options.getUser('user');
            await interaction.reply({
                ephemeral: true,
                content: `<@${target.id}> has ${getCoin(target.id)} coins`
            });
        } catch (e) {
            try {
                await interaction.reply({
                    content: `\`\`\`${e}\`\`\``,
                    ephemeral: true
                })
            } catch {
                // do nothing
            }
        }
	}
}