const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('node:fs');
const yaml = require('js-yaml');
const { lc, x, createStatFileIfItDoesntExists, getStat, setStat, setStatIfDoesntExists, unlockAchievement, addXP, getCoin, addCoin, ix, ep, Lynst, getRank, lyns, rankTopPercentile, getLoginSteak, getRequiredXP, uz, randASCIIstring, ctx, xtc, getRate, l, isJSON, ln, stp } = require('../../fn')
module.exports = {
	data: new SlashCommandBuilder()
		.setName('purge')
		.setDescription('bulk delete messages in a channel you ran this command.')
        .addIntegerOption(option => 
            option.setName('amount')
                .setDescription('if you want to delete recent 5 messages, type 5.')
                .setRequired(true))
        .addBooleanOption(option =>
            option.setName('ephemeral')
                .setDescription('If you want to show the result message to everyone, set false and go ahead.')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
	async execute(interaction) {
        try {
            const ch = interaction.channel;
            const a = interaction.options.getInteger('amount');
            const eph = interaction.options.getBoolean('ephemeral') ?? true;
            if (a) {
                ch.bulkDelete(a).then(async m => {
                    await interaction.reply({
                        content: `-# ***🖕 Bulk deleted ${m.size} messages.***`,
                        ephemeral: eph
                    })
                })
            }
        } catch (e) {
            await interaction.reply({
                content: `🤬\n${JSON.stringify(e, null, 2)}`,
                ephemeral: true
            })
        }
	}
}