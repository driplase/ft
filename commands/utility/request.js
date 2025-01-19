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
		.setName('request')
		.setDescription(x("command.request.description", "en_us"))
        .setDescriptionLocalizations({
            ja: x("command.request.description", "ja_JP")
        })
        .addUserOption(option => 
            option.setName('user')
                .setDescription('User to request coins.')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('coin amount')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('message')
                .setDescription('Message (optional)')
                .setRequired(false)),
	async execute(interaction) {
        try {
            const target = interaction.options.getUser('user'), lang = lci(interaction), amount = interaction.options.getInteger('amount');
            setStatIfDoesntExists(interaction.user.id, "crts", null)
            setStatIfDoesntExists(target.id, "crts", null)
            if (amount >= 1) {
                if (!target.bot && target.id !== interaction.user.id) {
                    setStatIfDoesntExists(interaction.user.id, "crq", [])
                    const S = getStat(interaction.user.id)
                    if (new Date().getTime() - S.crts >= 30 * 1e3) {
                        const requestId = (S.crq?.sort((a,b)=>b.id-a.id)?.at(0)?.id ?? 0) + 1
                        const td = {
                            id: requestId,
                            user: interaction.user.id,
                            target: target.id,
                            amount: amount,
                            status: "checking"
                        }, msg = interaction.options.getString('message')
                        msg ? td.message = msg : null
                        S.crq.push(td)
                        setStat(interaction.user.id, "crq", S.crq)
                        await interaction.reply({
                            content: x("command.request.check", lang),
                            components: [
                                { type: 1, components: [
                                    { type: 2, label: x("yes", lang), style: 3, custom_id: `creq${requestId}` },
                                    { type: 2, label: x("no", lang), style: 4, custom_id: `crqx${requestId}` }
                                ] },
                            ],
                            ephemeral: false
                        })
                        /*setStatIfDoesntExists(target.id, "coinRequests", [])
                        const trgStat = getStat(target.id), amount = interaction.options.getInteger('amount');
                        const requestData = {
                            user: target.id,
                            amount: amount,
                            timestamp: new Date().getTime()
                        }*/
                    } else {
                        await interaction.reply({
                            content: `${x('coolingDown', lang)} (<t:${Math.round(S.crts/1e3+30)}:R>)`,
                            ephemeral: true
                        })
                    }
                } else {
                    await interaction.reply({
                        content: x(target.id === interaction.user.id ? "command.request.yourself" : "command.request.botDenied", lang),
                        ephemeral: true
                    })
                }
            } else {}
        } catch (e) {
            console.error(e)
            await interaction.reply({
                content: "Something went wrong...",
                ephemeral: true
            })
        }
	},
};