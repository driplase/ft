const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('restart')
        .setDescription('AYO STOP THIS IS SUPER FREAKING IMPORTANT AND YOU SHOUDNT DO THIS')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        await interaction.reply({
            content: "restarting...",
            ephemeral: true
        }).then(() => {
            process.exit(-1);
        })
    },
};