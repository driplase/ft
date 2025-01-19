const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('node:fs');
const yaml = require('js-yaml');
const { lc, x, createStatFileIfItDoesntExists, getStat, setStat, setStatIfDoesntExists, unlockAchievement, addXP, getCoin, addCoin, ix, ep, Lynst, getRank, lyns, rankTopPercentile, getLoginSteak, getRequiredXP, uz, randASCIIstring, ctx, xtc, getRate, l, isJSON, ln, stp } = require('../../fn')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('addxp')
		.setDescription('PLEASE DO NOT USE HUGE NUMBER. IF THE NUMBER WAS SO BIG ENOUGH, FIRST TRERON MAY CAN BE OFFLINE')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('User.')
                .setRequired(true))
        .addIntegerOption(option => 
            option.setName('amount')
                .setDescription('negative int wont work lol')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
	async execute(interaction) {
        try {
            const target = interaction.options.getUser('user');
            const amount = interaction.options.getInteger('amount')
            setStatIfDoesntExists(target.id, "xp", 0)
            setStatIfDoesntExists(target.id, "level", 1)
            setStatIfDoesntExists(target.id, "lvxp", 0)
            addXP(target.id, amount)
            await interaction.deferReply({
                ephemeral: true
            });
            try {
                await interaction.editReply({
                    content: `${amount} XP given to <@!${target.id}>`,
                    ephemeral: true
                });
            } catch {
                // do nothing
            }
        } catch {
            try {
                await interaction.reply({
                    content: "error gg idk",
                    ephemeral: true
                })
            } catch {
                // do nothing
            }
        }
	},
};