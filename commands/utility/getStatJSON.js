const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('node:fs');
const yaml = require('js-yaml');
const { lc, x, createStatFileIfItDoesntExists, getStat, setStat, setStatIfDoesntExists, unlockAchievement, addXP, getCoin, addCoin, ix, ep, Lynst, getRank, lyns, rankTopPercentile, getLoginSteak, getRequiredXP, uz, randASCIIstring, ctx, xtc, getRate, l, isJSON, ln, stp } = require('../../fn')
module.exports = {
	data: new SlashCommandBuilder()
		.setName('getstatjson')
		.setDescription('go check https://first.treron.jp/stats?id=<userId> instead')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('User.')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
	async execute(interaction) {
        try {
            const target = interaction.options.getUser('user'), stat = getStat(target.id);
            delete stat.cghistory
            await interaction.reply({
                ephemeral: true,
                content: stat ? null : 'stat file doesn\'t exists.',
                embeds: [
                    stat ? new EmbedBuilder().setDescription(`\`\`\`json\n${JSON.stringify(stat, null, 2)}\`\`\``)
                        .setTitle(target.id)
                        .setColor(Math.round(Math.random() * 16777215)) : null
                ]
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