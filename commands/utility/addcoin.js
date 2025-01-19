const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, Client, GatewayIntentBits } = require('discord.js');
const fs = require('node:fs');
const { tukyn } = require('../../config.json');
const { lc, x, createStatFileIfItDoesntExists, getStat, setStat, setStatIfDoesntExists, unlockAchievement, addXP, getCoin, addCoin, ix, ep, Lynst, getRank, lyns, rankTopPercentile, getLoginSteak, getRequiredXP, uz, randASCIIstring, ctx, xtc, getRate, l, isJSON, ln, stp } = require('../../fn')
const client = new Client({
	intents: [
        GatewayIntentBits.Guilds
    ]
});

module.exports = {
	data: new SlashCommandBuilder()
		.setName('addcoin')
		.setDescription('add coins so that means cheat bruh')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('yeah, user')
                .setRequired(true))
        .addIntegerOption(option => 
            option.setName('amount')
                .setDescription('do not enter a biggerest integer')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
	async execute(interaction) {
        try {
            const user = interaction.options.getUser('user')
            const amount = interaction.options.getInteger('amount');
            addCoin(user.id, amount, interaction.guild)
            await interaction.reply({
                content: `${amount} coins added to <@${user.id}>`,
                ephemeral: true
            })
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