const { SlashCommandBuilder, EmbedBuilder, Client, GatewayIntentBits, GuildMember, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const fs = require('node:fs');
const yaml = require('js-yaml');
const { lc, x, createStatFileIfItDoesntExists, getStat, setStat, setStatIfDoesntExists, unlockAchievement, addXP, getCoin, addCoin, ix, ep, Lynst, getRank, lyns, rankTopPercentile, getLoginSteak, getRequiredXP, uz, randASCIIstring, ctx, xtc, getRate, l, isJSON, ln, stp, isStreakSafe, lci } = require('../../fn')

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers
	]
});
module.exports = {
	data: new SlashCommandBuilder()
		.setName('reapply')
		.setDescription(x("command.reapply.description", "en_us"))
        .setDescriptionLocalizations({
            ja: x("command.reapply.description", "ja_JP")
        })
        .addStringOption(option => 
            option.setName('color')
                .setDescription('select a color.')
                .setRequired(true)
                .setAutocomplete(true)),
        async autocomplete(interaction) {
            const cr = interaction.guild.roles.cache.sort((a,b)=>b.rawPosition-a.rawPosition).filter(i=>i.name.startsWith('!'))
            const cv = cr.map(i=>{return{name:i.name,value:i.id}})
            const fo = interaction.options.getFocused(true)
            if (fo.name === "color") {
                let F = cv.filter(c => c.name.toLowerCase().includes(fo.value.toLowerCase()))
                await interaction.respond(F.slice(0,25),)
            }
        },
	async execute(interaction) {
        try {
            await interaction.deferReply()
            const cr = interaction.guild.roles.cache.filter(i=>i.name.startsWith('!')), col = interaction.options.getString('color'), lang = lci(interaction)
            if (!interaction.member.roles.cache.has(col)) {
                if (cr.map(i=>i.id).includes(col)) {
                    setStatIfDoesntExists(interaction.user.id, "reapplied", 0)
                    const S = getStat(interaction.user.id)
                    if (S.cghistory.includes(col)) {
                        const rqc = Math.floor(500 + 12 * Math.sqrt(S.reapplied ** 3));
                        if (addCoin(interaction.user.id, -rqc)) {
                            const r = interaction.member.roles.cache.filter(i=>i.name.startsWith('!')).map(i=>i.id)
                            for (let i in r) {
                                r[i] !== col ? interaction.member.roles.remove(r[i]) : null
                            }
                            interaction.member.roles.add(col)
                            await interaction.editReply({
                                ephemeral: false,
                                content: x("command.reapply.reapplied", lang)
                            })
                            S.reapplied++
                            setStat(interaction.user.id, "reapplied", S.reapplied)
                        } else {
                            await interaction.editReply({
                                content: x("command.reapply.notEnoughCoins", lang).replace('<coins>', `**${rqc.toLocaleString()} <:coin:1284070241005080606>**`),
                                ephemeral: true
                            })
                        }
                    } else {}
                } else {}
            } else {
                await interaction.editReply({
                    content: x("command.reapply.already", lang)
                })
            }
        } catch (e) {
            console.error(e)
            await interaction.editReply({
                content: "Something went wrong...",
                ephemeral: true
            })
        }
	},
};