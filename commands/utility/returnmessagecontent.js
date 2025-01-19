const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('node:fs');
const yaml = require('js-yaml');
const { lc, x, createStatFileIfItDoesntExists, getStat, setStat, setStatIfDoesntExists, unlockAchievement, addXP, getCoin, addCoin, ix, ep, Lynst, getRank, lyns, rankTopPercentile, getLoginSteak, getRequiredXP, uz, randASCIIstring, ctx, xtc, getRate, l, isJSON, ln, stp } = require('../../fn')
module.exports = {
	data: new SlashCommandBuilder()
		.setName('returnmessagecontent')
		.setDescription('if you r nt a mod report via contact or mod\'s dm')
        .addStringOption(option => 
            option.setName('messageid')
                .setDescription('msgid')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
	async execute(interaction) {
        const target = interaction.options.getString('messageid');
        const ch = await interaction.channel.messages.fetch(target);
        await interaction.reply({
            ephemeral: true,
            content: `\`\`\`${ch.content}\`\`\``
        });
	}
}