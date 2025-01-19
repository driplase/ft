const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('shortenedinvitelink')
		.setDescription('Get shortened invite link of this server. shortened link by j0.si, driplase\'s link shortener <3'),
	async execute(interaction) {
		await interaction.reply({
            content: "https://j0.si/lt",
            ephemeral: true
        });
	},
};